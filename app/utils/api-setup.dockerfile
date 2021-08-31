FROM ruby:2.6.5-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
RUN gem install rails

RUN rails new api --api