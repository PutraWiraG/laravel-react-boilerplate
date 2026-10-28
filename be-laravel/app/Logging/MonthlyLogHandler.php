<?php

namespace App\Logging;

use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Level;
use Monolog\LogRecord;
use Monolog\Logger;

class MonthlyLogHandler extends AbstractProcessingHandler
{
    private ?StreamHandler $handler = null;
    private ?string $currentMonth = null;
    private Level|int|string $minimumLevel;

    public function __construct(
        Level|int|string $level = Logger::DEBUG,
        bool $bubble = true
    ) {
        parent::__construct($level, $bubble);
        $this->minimumLevel = $level;
    }

    protected function write(LogRecord $record): void
    {
        $month = $record->datetime->format('Y-m');

        if ($this->currentMonth !== $month) {
            $this->handler?->close();

            $this->handler = new StreamHandler(
                storage_path("logs/laravel-{$month}.log"),
                $this->minimumLevel
            );

            $this->currentMonth = $month;
            $this->cleanOldLogs($month);
        }

        $this->handler->handle($record);
    }

    private function cleanOldLogs(string $currentMonth): void
    {
        $cutoffMonth = \DateTimeImmutable::createFromFormat(
            '!Y-m',
            $currentMonth
        )->modify('-11 months')->format('Y-m');

        foreach (glob(storage_path('logs/laravel-????-??.log')) ?: [] as $file) {
            if (
                preg_match('/laravel-(\d{4}-\d{2})\.log$/', $file, $matches)
                && $matches[1] < $cutoffMonth
            ) {
                @unlink($file);
            }
        }
    }

    public function close(): void
    {
        $this->handler?->close();
        parent::close();
    }
}
