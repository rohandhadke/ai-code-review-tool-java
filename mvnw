#!/bin/sh
# Maven Wrapper script
# Downloads and runs Maven if not already available

set -e

MAVEN_WRAPPER_PROPERTIES=".mvn/wrapper/maven-wrapper.properties"

if [ ! -f "$MAVEN_WRAPPER_PROPERTIES" ]; then
    echo "Error: Maven wrapper properties not found at $MAVEN_WRAPPER_PROPERTIES"
    exit 1
fi

# Read distribution URL
distributionUrl=$(grep 'distributionUrl' "$MAVEN_WRAPPER_PROPERTIES" | cut -d'=' -f2-)

MAVEN_HOME="${HOME}/.m2/wrapper/dists/$(basename "$distributionUrl" .zip)"

if [ ! -d "$MAVEN_HOME" ]; then
    echo "Downloading Maven from $distributionUrl..."
    mkdir -p "$MAVEN_HOME"
    TMPFILE=$(mktemp)
    curl -fsSL "$distributionUrl" -o "$TMPFILE"
    unzip -q -o "$TMPFILE" -d "$MAVEN_HOME"
    rm "$TMPFILE"
fi

MAVEN_BIN=$(find "$MAVEN_HOME" -name "mvn" -path "*/bin/mvn" | head -1)

if [ -z "$MAVEN_BIN" ]; then
    echo "Error: Could not find mvn binary in $MAVEN_HOME"
    exit 1
fi

exec "$MAVEN_BIN" "$@"
