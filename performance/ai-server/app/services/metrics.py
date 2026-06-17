from __future__ import annotations

import time
from dataclasses import dataclass, field


@dataclass
class MetricsState:
    total_requests: int = 0
    total_errors: int = 0
    total_latency_ms: float = 0.0
    sessions: set[str] = field(default_factory=set)

    def record(self, session_id: str, latency_ms: float, error: bool = False) -> None:
        self.total_requests += 1
        self.total_latency_ms += latency_ms
        self.sessions.add(session_id)
        if error:
            self.total_errors += 1

    @property
    def avg_latency_ms(self) -> float:
        if self.total_requests == 0:
            return 0.0
        return self.total_latency_ms / self.total_requests


metrics_state = MetricsState()


class Timer:
    def __enter__(self) -> "Timer":
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        self.elapsed_ms = (time.perf_counter() - self.start) * 1000.0
