@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __ MVNW_CMD_LINE_ARGS=%*
@SET ERROR_CODE=0

@SET MAVEN_PROJECTBASEDIR=%~dp0
IF NOT "%MAVEN_PROJECTBASEDIR:~-1%"=="\" SET MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.7/apache-maven-3.9.7-bin.zip"

FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties") DO (
    IF "%%A"=="distributionUrl" SET DOWNLOAD_URL=%%B
)

@SET JAVA_HOME_FALLBACK=
FOR /F "tokens=*" %%i IN ('where java 2^>nul') DO (
    IF NOT DEFINED JAVA_HOME_FALLBACK SET JAVA_HOME_FALLBACK=%%~dpi..
)

IF NOT DEFINED JAVA_HOME SET JAVA_HOME=%JAVA_HOME_FALLBACK%

"%JAVA_HOME%\bin\java.exe" -cp %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%

IF %ERRORLEVEL% NEQ 0 GOTO error
GOTO end

:error
SET ERROR_CODE=1

:end
@endlocal & SET ERROR_CODE=%ERROR_CODE%
EXIT /B %ERROR_CODE%
