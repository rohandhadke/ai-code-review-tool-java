@REM Maven Wrapper script for Windows
@REM Downloads and runs Maven if not already available

@echo off
setlocal

set MAVEN_WRAPPER_PROPERTIES=.mvn\wrapper\maven-wrapper.properties

if not exist "%MAVEN_WRAPPER_PROPERTIES%" (
    echo Error: Maven wrapper properties not found at %MAVEN_WRAPPER_PROPERTIES%
    exit /b 1
)

for /f "tokens=1,* delims==" %%a in ('findstr "distributionUrl" "%MAVEN_WRAPPER_PROPERTIES%"') do set "distributionUrl=%%b"

set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists"

REM Check if maven is already downloaded
if exist "%MAVEN_HOME%\apache-maven-3.9.9\bin\mvn.cmd" (
    "%MAVEN_HOME%\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

echo Downloading Maven from %distributionUrl%...
mkdir "%MAVEN_HOME%" 2>nul
powershell -Command "Invoke-WebRequest -Uri '%distributionUrl%' -OutFile '%TEMP%\maven.zip'"
powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%MAVEN_HOME%' -Force"
del "%TEMP%\maven.zip"

"%MAVEN_HOME%\apache-maven-3.9.9\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%
