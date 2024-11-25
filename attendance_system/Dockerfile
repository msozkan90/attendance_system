FROM python:3.11.0-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV APP_HOME=/app

COPY ./requirements.txt .

COPY .$APP_HOME $APP_HOME

WORKDIR $APP_HOME

EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk update && apk add --no-cache libpq postgresql-client && rm -rf /var/cache/apk/* && \
    /py/bin/pip install -r /requirements.txt && \
    rm -rf /var/lib/apt/lists/* && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user && \

    mkdir -p /vol/web/staticfiles && \
    mkdir -p /vol/web/media && \

    chown -R django-user:django-user $APP_HOME && \
    chmod -R 755 $APP_HOME && \
    chown -R django-user:django-user /py/lib/python3.11/site-packages/ && \
    chmod -R 755 /py/lib/python3.11/site-packages/ && \
    chown -R django-user:django-user /vol && \
    chmod -R 755 /vol && \
    chmod -R 755 /vol/web/media && \
    chown -R django-user:django-user /vol/web/media

ENV PATH="/py/bin:$PATH"

USER django-user
