/opt/mssql-tools/bin/sqlcmd -U sa -P "$MSSQL_SA_PASSWORD" -b -Q "
  IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ELCC')
  BEGIN
    CREATE DATABASE ELCC;
  END
"
