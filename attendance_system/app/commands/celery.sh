#!/bin/sh

celery -A attendance_system worker -l INFO -c 1 --max-memory-per-child=50000