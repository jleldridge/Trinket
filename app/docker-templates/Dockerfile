FROM ruby:2.6.5-slim AS api-builder

RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev libxml2-dev shared-mime-info

ENV RAILS_ROOT=/app
ENV RAILS_ENV=production
ENV BUNDLE_APP_CONFIG="$RAILS_ROOT/.bundle"

WORKDIR $RAILS_ROOT

RUN gem install bundler -v 2.1.4  --no-document

COPY ./api/Gemfile ./api/Gemfile.lock ./

RUN bundle config --global frozen 1 && \
    bundle install --without development:test:assets --verbose --jobs 20 --retry 5 --path=vendor/bundle && \
    # Remove unneeded files (cached *.gem, *.o, *.c)
    rm -rf vendor/bundle/ruby/2.6.0/cache/*.gem && \
    find vendor/bundle/ruby/2.6.0/gems/ -name "*.c" -delete && \
    find vendor/bundle/ruby/2.6.0/gems/ -name "*.o" -delete && \
    # Creates the rails and pids directories and all the parents (if they don't exist)
    mkdir -p $RAILS_ROOT/tmp/pids

COPY ./api ./
# COPY /.docker/Procfile ./

FROM node:14-slim AS web-builder
RUN apt-get update \
  && apt-get install -y nodejs yarn

WORKDIR /web
COPY ./web ./
RUN yarn install
RUN yarn build

FROM nginx
COPY ./.docker/nginx/default.conf /etc/nginx/templates/default.conf.template
COPY --from=web-builder /web/dist /usr/share/nginx/html/web

CMD ["nginx", "-g", "daemon off;"]