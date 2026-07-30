<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup script (only-script distribution)
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PSMODULEP_SAVE=%PSModulePath%
@SET PSModulePath=
@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%~nx0'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
  IF "%%A"=="MVN_CMD" (set __MVNW_CMD__=%%B) ELSE IF "%%B"=="" (echo %%A) ELSE (echo %%A=%%B)
)
@SET PSModulePath=%__MVNW_PSMODULEP_SAVE%
@SET __MVNW_PSMODULEP_SAVE=
@SET __MVNW_ARG0_NAME__=
@SET MVNW_USERNAME=
@SET MVNW_PASSWORD=
@IF NOT "%__MVNW_CMD__%"=="" (%__MVNW_CMD__% %*)
@echo Cannot start maven from wrapper >&2 && exit /b 1
@GOTO :EOF
: end batch / begin powershell #>

$ErrorActionPreference = "Stop"
if ($env:MVNW_VERBOSE -eq "true") { $VerbosePreference = "Continue" }

if (-not $env:JAVA_HOME) {
  $script:JAVACMD = (Get-Command -Name "java" -ErrorAction SilentlyContinue).Source
} else {
  $script:JAVACMD = Join-Path $env:JAVA_HOME "bin\java.exe"
}
if (-not $script:JAVACMD -or -not (Test-Path $script:JAVACMD)) {
  Write-Error "Cannot find 'java' — set JAVA_HOME or add java to PATH."
}

$distributionUrl = (Get-Content -Raw "$scriptDir\.mvn\wrapper\maven-wrapper.properties" | ConvertFrom-StringData).distributionUrl
if (-not $distributionUrl) { Write-Error "cannot read distributionUrl property" }

$distributionUrlName = $distributionUrl -replace '^.*/', ''
$distributionUrlNameMain = $distributionUrlName -replace '\.[^.]*$', '' -replace '-bin$', ''
$MAVEN_USER_HOME = if ($env:MAVEN_USER_HOME) { $env:MAVEN_USER_HOME } else { "$HOME\.m2" }

$hash = [BitConverter]::ToString(
  (New-Object Security.Cryptography.SHA256Managed).ComputeHash(
    [Text.Encoding]::UTF8.GetBytes($distributionUrl))).Replace("-", "").ToLower().Substring(0, 8)

$MAVEN_HOME = "$MAVEN_USER_HOME\wrapper\dists\$distributionUrlNameMain\$hash"

if (Test-Path -Path "$MAVEN_HOME" -PathType Container) {
  Write-Verbose "found existing MAVEN_HOME at $MAVEN_HOME"
  Write-Output "MVN_CMD=$MAVEN_HOME\bin\mvn.cmd"
  exit $?
}

$TMP_DOWNLOAD_DIR = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
New-Item -ItemType Directory -Path $TMP_DOWNLOAD_DIR | Out-Null

try {
  Write-Verbose "Downloading $distributionUrl"
  $webclient = New-Object System.Net.WebClient
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $webclient.DownloadFile($distributionUrl, "$TMP_DOWNLOAD_DIR\$distributionUrlName") | Out-Null

  Expand-Archive -Path "$TMP_DOWNLOAD_DIR\$distributionUrlName" -DestinationPath $TMP_DOWNLOAD_DIR | Out-Null

  New-Item -ItemType Directory -Path (Split-Path $MAVEN_HOME) -Force -ErrorAction SilentlyContinue | Out-Null
  Rename-Item -Path "$TMP_DOWNLOAD_DIR\$distributionUrlNameMain" -NewName (Split-Path $MAVEN_HOME -Leaf)
  Move-Item -Path "$TMP_DOWNLOAD_DIR\$(Split-Path $MAVEN_HOME -Leaf)" -Destination (Split-Path $MAVEN_HOME)
} finally {
  Remove-Item $TMP_DOWNLOAD_DIR -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Output "MVN_CMD=$MAVEN_HOME\bin\mvn.cmd"
