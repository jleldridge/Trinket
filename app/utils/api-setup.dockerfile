FROM rails:latest

# ENV RAILS_ROOT=/app
# ENV RAILS_ENV=development
# ENV BUNDLE_APP_CONFIG="$RAILS_ROOT/.bundle"

# WORKDIR $RAILS_ROOT

RUN rails new api