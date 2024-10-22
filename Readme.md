# Mazda-art-API

Mazda Art apis.

---

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

### Yarn installation

After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/YOUR_USERNAME/PROJECT_TITLE
    $ cd PROJECT_TITLE
    $ yarn install

## Configure app

Open `a/nice/path/to/a.file` then edit it with your settings. You will need:

- A setting;
- Another setting;
- One more setting;

## Running the project

    $ yarn start

## Simple build for production

    $ yarn build

## Install Postman for Debugging

Install Postman (https://www.getpostman.com/). Signing up for an account is not necessary, you can go straight to the app.

### Importing the collection

In the top left corner is an _import_ button. Either drag the `Altinn.postman_collection.json` file from `postman-examples/Collection` into the window or click _choose files_ and select it.

### Importing the environments

In the top right corner there is a button with a cog wheel called _manage environments_. Click it, then click the _import_ button, then click _choose files_. Select all the json-files in `postman-examples/environments/` and click _open_.

For more information, go to https://altinn.github.io/docs/api/rest/

### Using enterprise certificate authentication

When using [authentication with enterprise certificates](https://altinn.github.io/docs/api/rest/kom-i-gang/) (link in norwegian only), you must configure a [client certificate in Postman](https://learning.getpostman.com/docs/postman/sending-api-requests/certificates/). For testing in dev environment without TLS-termination, you must supply the certificate in Base64 PEM format (without BEGIN/END headers) in a HTTP header named `X-ENV-SSL_CLIENT_CERTIFICATE` for authorization to take place.

For all non-dev environments, all requests must include the query parameter `ForceEIAuthentication` in order for TLS client authentication to take place. This is already included in all service owner operations.

### Using Bearer token authentication

When using [authentication with Maskinporten](https://altinn.github.io/docs/api/rest/kom-i-gang/) (link in norwegian only), you must configure the requests in postman for [Bearer token](https://learning.postman.com/docs/sending-requests/authorization/#bearer-token).
This can also be combined with the [MaskinportenTokenGenerator](https://github.com/Altinn/MaskinportenTokenGenerator) utility, which can be used to retrieve and set the bearer token on the request through a [pre-request script](https://github.com/Altinn/MaskinportenTokenGenerator#postman-integration).

## Postgres Database configuration

PostgreSQL Installation Guide
Prerequisites
Before you begin, ensure you have the following:

# Administrative access to your system.

An internet connection to download PostgreSQL packages.
Installation
Windows
Download PostgreSQL Installer:

# Visit the PostgreSQL download page.

Download the installer for your version of Windows.
Run the Installer:

# Open the downloaded installer file.

Follow the prompts to complete the installation. You will be asked to set a password for the PostgreSQL superuser (postgres).
Environment Variables (Optional):

# Add the PostgreSQL bin directory to your PATH environment variable to use psql and other PostgreSQL tools from the command line.

macOS
Using Homebrew:

Open Terminal.
Install Homebrew if you haven't already:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

# Run the following commands to install PostgreSQL:

```
brew update
```

```
brew install postgresql
```

```
Start PostgreSQL Service:
```

# To start PostgreSQL automatically at login:

brew services start postgresql
To start PostgreSQL manually:

```
pg_ctl -D /usr/local/var/postgres start
```

# Linux

Ubuntu/Debian
Add PostgreSQL APT Repository:

Open Terminal.
Run the following commands to add the PostgreSQL APT repository:

```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

```
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
```

```
sudo apt-get update
```

# Install PostgreSQL:

Run the following command to install PostgreSQL:

```
sudo apt-get install postgresql postgresql-contrib
```

Start PostgreSQL Service:

Run the following command to start the PostgreSQL service:

```
sudo systemctl start postgresql
```

```
CentOS/RHEL
```

Open Terminal.
Run the following commands to add the PostgreSQL YUM repository:

```
sudo yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-$(rpm -E %{rhel})-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

```
sudo yum install -y epel-release yum-utils
```

Install PostgreSQL:

Run the following command to install PostgreSQL:

```
sudo yum install -y postgresql13-server postgresql13
```

Initialize and Start PostgreSQL:

Initialize the database:

```
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
```

Start the PostgreSQL service:

```
sudo systemctl start postgresql-13
```

## Basic Usage

Accessing PostgreSQL
Open PostgreSQL Command Line:

Use the psql command-line tool to access PostgreSQL.
Run the following command and enter the password when prompted:

```
psql -U postgres
```

# Create a New Database:

Run the following SQL command to create a new database:

```
CREATE DATABASE mydatabase;
Connect to the New Database:
```

Run the following command to connect to your new database:

```
\c mydatabase
```

# Create a New Table:

Run the following SQL command to create a new table:

```
CREATE TABLE mytable (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);
```

# Insert Data into the Table:

Run the following SQL command to insert data:

```
INSERT INTO mytable (name) VALUES ('Alice'), ('Bob');
Query the Table:
```

Run the following SQL command to query the table:

```
SELECT * FROM mytable;
Additional Resources
PostgreSQL Documentation
PostgreSQL Tutorials
```

# Useful Postgres Commands

### 1. Determine disk usage of a particular table/database

For a particular table,

```
SELECT pg_size_pretty( pg_total_relation_size('tablename') );
```

For a particular database,

```
SELECT pg_size_pretty( pg_database_size('dbname') );
```

### 2. Show config file location

```
$ psql -U postgres -c 'SHOW config_file'
```

### 3. Export data from a database table to a CSV file

```
COPY (SELECT "dbname".* FROM "tablename")
  TO '/tmp/output-file.csv'
  WITH DELIMITER ';' CSV HEADER
```

### 4. Import data from a CSV file to database

```
COPY tablename
  FROM '/tmp/input-file.csv'
```

### 5. Grant privileges

```
REVOKE ALL ON DATABASE example_database FROM example_user;
GRANT CONNECT ON DATABASE example_database TO example_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO example_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO example_user;

# Grant all privileges on all tables to a particular user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO example_user;

# Grant all privileges on all tables (both existing and new tables) to a certain user
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO example_user;

# View a user's grants
SELECT table_catalog, table_schema, table_name, privilege_type FROM information_schema.table_privileges WHERE grantee = 'example_user' ORDER BY table_name ASC;
```

OR

```
GRANT USAGE ON SCHEMA public TO my_db_user;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO my_db_user;

-- If you have sequences
GRANT SELECT, UPDATE, USAGE ON ALL SEQUENCES IN SCHEMA public to my_db_user;

-- If you have functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO my_db_user;


-- Cater for future tables that will be created
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE, TRIGGER ON TABLES TO my_db_user;
```

### 6. Find slow queries

Check that you have the pg_stat_statements extension installed

```
 postgres=# \x
 postgres=# \dx pg_stat_statements
```

If you dnn't obtain any result, then issue the following command:

```
postgres=# CREATE EXTENSION pg_stat_statements;
postgres=# ALTER SYSTEM
          SET shared_preload_libraries = 'pg_stat_statements';
```

Then, restart the server

You can get the top ten highest workloads on your server side by executing the following:

```
postgres=# SELECT calls, total_time, query FROM pg_stat_statements
           ORDER BY total_time DESC LIMIT 10;
```

There are many additional columns that are useful in tracking down further information about particular entries

```
postgres=# \d pg_stat_statements
          View "public.pg_stat_statements"
       Column        |       Type       | Modifiers
---------------------+------------------+-----------
 userid              | oid              |
 dbid                | oid              |
 queryid             | bigint           |
 query               | text             |
 calls               | bigint           |
 total_time          | double precision |
 min_time            | double precision |
 max_time            | double precision |
 mean_time           | double precision |
 stddev_time         | double precision |
 rows                | bigint           |
 shared_blks_hit     | bigint           |
 shared_blks_read    | bigint           |
 shared_blks_dirtied | bigint           |
 shared_blks_written | bigint           |
 local_blks_hit      | bigint           |
 local_blks_read     | bigint           |
 local_blks_dirtied  | bigint           |
 local_blks_written  | bigint           |
 temp_blks_read      | bigint           |
 temp_blks_written   | bigint           |
 blk_read_time       | double precision |
 blk_write_time      | double precision |
```

### 7. Find slow queries that takes over 10 seconds

```
postgres=# ALTER SYSTEM
          SET log_min_duration_statement = 10000;
```

### 8. Rename table

```
ALTER TABLE IF EXISTS table_name
RENAME TO new_table_name;
```

### 9. Get database owner

```
SELECT d.datname as "Name",
pg_catalog.pg_get_userbyid(d.datdba) as "Owner"
FROM pg_catalog.pg_database d
WHERE d.datname = 'db_name'
ORDER BY 1;
```

or if you are using the `psql`:

```
# \l db_name
```

### 10. Bulk load CSV file into postgres table

Assuming the table `my_table` already exists,

```
\copy my_table (col1, col2, col3, ...) FROM '/path/to/csv-file.csv' CSV HEADER;
```

### 11. Make a dump (copy) of your database

```
$ pg_dump <dbname> -U <dbuser> -f <filename>.sql

# If you want to compress the database dump
$ pg_dump <dbname> -U <dbuser> | gzip > <filename>.sql.gz
```

### 12. To restore database dump copy on another system

1. Create an empty database or clear out the existing database

```
# To clear out an existing database/schema
$ psql -U <dbuser> -d <dbname> -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
```

2. Gunzip the copy, if you created a compressed version
3. Run the following command to restore:

```
$ psql -d <dbname> -U <dbuser> -f <filename>.sql
```

### 13. Select random records

```
SELECT *
FROM words
WHERE difficulty = 'Easy' AND category_id = 3
ORDER BY random()
LIMIT 1;
```

### 14. List all the tables in a particular schema

```
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

Alternatively,

For all schemas

```
=> \dt *.*
```

For a particular schema,

```
=> \dt public.*
```

### 15. Locate Postgres configuration files

```
SHOW hba_file;

SHOW config_file;
```

### 16. How to reload config settings without restarting database

```
su - postgres

/usr/bin/pg_ctl reload
```

Alternatively, you can use SQL

```
SELECT pg_reload_conf();
```

### 17. Select bytea column data as string

```
SELECT convert_from(decode(<bytea_column>, 'escape'), 'UTF-8') FROM <table_name>;
```

### 18. How to determine the PostgreSQL and PostGIS versions

From the command line,

```shell script
psql --version
```

Alternatively, from _PSQL_ program

```sql
SELECT version(); # postgres version

SELECT PostGIS_full_version(); # postgis version
```

### 19. [🔗](https://www.postgresql.org/docs/current/sql-createuser.html) Create PostgreSQL User

To create a postgreSQL user with a create database permission only, you can use any of the approaches below:

```sql
# Without password
CREATE ROLE myuser;
ALTER ROLE myuser WITH CREATEDB;

# with password
CREATE ROLE myuser;
ALTER ROLE myuser WITH LOGIN ENCRYPTED PASSWORD 'somepassword' CREATEDB;
```

Alternatively,

```sql
# Without password
CREATE ROLE myuser CREATEDB;

# With password (Option 1)
CREATE ROLE myuser WITH LOGIN ENCRYPTED PASSWORD 'somepassword' CREATEDB;

# With password and superuser privileges (Option 2)
CREATE USER myuser WITH SUPERUSER CREATEDB LOGIN ENCRYPTED PASSWORD 'somepassword';
```

> If `CREATEDB` is specified, the created user will be allowed to create their own databases.
> Using `NOCREATEDB` will deny the user the ability to create databases. If not specified, `NOCREATEDB` is the default

### 20. Change PostgreSQL User Password

To change the password of a Postgres user:

1. Login to Postgres without a password

```
sudo -u <user_name> psql db_name
```

For example,

```
sudo -u postgres psql dhis2
```

2. Reset the password

```
ALTER USER <user_name> WITH PASSWORD '<new_password>';
```

Alternatively,

```
sudo -u postgres psql

\password postgres
```

### 21. Hide result set decoration in Psql output

To hide the column names included as part of the query resultset in psql, you can pass the `-t` or `--tuples-only` flag to psql:

```
$ psql --user=dbuser -d mydb -t -c "SELECT count(*) FROM dbtable;"
```

### 22. Check if a Postgres database exist (case-insensitive way)

```
SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = 'db-name-in-lower-case';
```

Alternatively from the command line,

```
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'db-name'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE db-name"
```

### 23. Check if a Postgres user exist

```
SELECT 1 FROM pg_roles WHERE rolname='the-postgres-username'
```

If you'd rather run it from the command line:

```
psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='the-postgres-username'"
```

On unix, you can use grep to chain multiple commands:

```
psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='the-postgres-username'" | grep -q 1 || createuser ...
```

### 24. Check if a Postgres schema exist

```
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'schema-name';
```

If you will like to create a schema if one doesn't already exist,

```
CREATE SCHEMA IF NOT EXISTS `schema-name`;
```

Likewise for Postgres extensions:

```
CREATE EXTENSION IF NOT EXISTS `extension-name`;
```

### 25. Query active Postgres configuration parameter value

```sql
SELECT name, setting FROM pg_settings;
SELECT setting FROM pg_settings WHERE name = 'max_locks_per_transaction';
```

### 26. Check if a table column exists

```
SELECT column_name FROM information_schema.columns WHERE table_name='the_table_name' and column_name='the_column_name';

# OR

SELECT column_name FROM information_schema.columns WHERE table_name='the_table_name' and column_name='the_column_name';
```

Alternatively, you can adapt the query to return `true/false`:

```sql
SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='my_schema_name' AND table_name='my_table_name' AND column_name='my_column_name');
```

### 27. List installed postgresql extensions

```
postgres=# \dx
                 List of installed extensions
  Name   | Version |   Schema   |         Description
---------+---------+------------+------------------------------
 plpgsql | 1.0     | pg_catalog | PL/pgSQL procedural language
 postgis | 2.4.4   | postgis    | PostGIS geometry, geography, and raster spatial types and functions
(2 rows)
```

To get more details,

```
postgres=# \dx+ plpgsql
      Objects in extension "plpgsql"
            Object Description
-------------------------------------------
 function plpgsql_call_handler()
 function plpgsql_inline_handler(internal)
 function plpgsql_validator(oid)
 language plpgsql
(4 rows)
```

Alternatively,

```
SELECT * FROM pg_extension;
```

To get the list of all available extensions on your server,

```
SELECT * FROM pg_available_extensions;
```

### 28. List all available schemas

1. Using SQL Query

You can get the list of all schemas using SQL with the ANSI standard of `INFORMATION_SCHEMA`:

```
SELECT schema_name FROM information_schema.schemata
```

or

```
SELECT nspname FROM pg_catalog.pg_namespace;
```

Information schema is simply a set of views of `pg_catalog`.

2. Using psql

```
\dn
```

### 29. [🔗](https://www.postgresql.org/docs/current/sql-droprole.html) Drop User Role If Exists

```
DROP ROLE IF EXISTS bambini;
```

### 30. Delete Function

```
DROP FUNCTION IF EXISTS My_Function(TEXT, INT);
```

Postgres functions can be [overloaded](http://www.postgresql.org/docs/9.4/static/xfunc-overload.html), therefore specifying the parameter types are necessary to reduce ambiguity while differentiating between overloaded functions.

### 31. Change Database Owner

```
ALTER DATABASE <db-name> OWNER TO <new-owner-name>;
```

### 32. Get Database Owner

```
SELECT datname, pg_user.usename as owner_username
FROM pg_database
JOIN pg_user ON pg_database.datdba = pg_user.usesysid
WHERE datname = '<db-name>';
```

### 33. Create a copy of your database

```
CREATE DATABASE <new-db-name>
WITH TEMPLATE <name-of-db-to-be-copied>
OWNER <db-owner>;
```

If the database to be copied is being accessed by any user, all connections to it may have to be terminated before
you can create a copy of that database. You can achieve this with:

```
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '<name-of-db-to-be-copied>'
AND pid <> pg_backend_pid();
```

After which you can proceed with the database copy command provided previously.

### 34. Rename database

Check the all active connections to the database before the rename:

```
SELECT  *
FROM pg_stat_activity
WHERE datname = '<current-db-name>';
```

Terminate all active connections, if any:

```
SELECT
    pg_terminate_backend (pid)
FROM
    pg_stat_activity
WHERE
    datname = '<current-db-name>';
```

Proceed with the rename once this is done:

```
ALTER DATABASE <current-db-name> RENAME TO <new-db-name>;
```

### 35. Get a user's privileges

```
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb FROM pg_roles WHERE rolname = '<role>';
```

### 36. Get the list of all tables in the database and their sizes

```
SELECT
  nspname || '.' || relname AS "Table",
  pg_size_pretty(pg_total_relation_size(C.oid)) AS "Size"
FROM
  pg_class C
  LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
WHERE
  nspname NOT IN ('pg_catalog', 'information_schema')
  AND C.relkind <> 'i'
  AND nspname !~ '^pg_toast'
ORDER BY
  pg_total_relation_size(C.oid) DESC;
```

## Payment Integration Steps

1. **Customer Initiates Payment**: The customer clicks the "Pay" button on the frontend.
2. **Create Order on Backend**: The backend API creates an order using Razorpay’s `createOrder` API.
3. **Send Order ID to Frontend**: The backend returns the generated `order_id` to the frontend.
4. **Customer Fills Razorpay Checkout Form**: The customer enters their payment details using Razorpay’s prefilled form.
5. **Razorpay Verifies Payment Details**: Razorpay checks the payment information.
6. **Payment Successful**: If the payment is successful, Razorpay sends the `payment_id` and `signature` to the frontend.
7. **Send Payment Response to Backend**: The frontend sends the `order_id`, `payment_id`, and `signature` to the backend.
8. **Backend Verifies Payment Signature**: The backend verifies the payment by checking the signature using Razorpay’s API.
9. **Payment Confirmed**: Once verified, the payment is confirmed, and the customer receives a confirmation message.

## OTP Verification Steps

10. **Generate OTP**: When the customer initiates a payment or signs up, the backend generates a One-Time Password (OTP).
11. **Send OTP via SMS**: The backend uses Twilio’s API to send the OTP to the customer’s mobile number.
12. **Customer Enters OTP**: The customer receives the OTP and enters it on the frontend.
13. **Verify OTP**: The frontend sends the entered OTP to the backend for verification.
14. **Backend Confirms OTP**: The backend verifies the OTP and confirms the customer's identity.

## Email Notification Steps

15. **Send Confirmation Email**: After the payment is confirmed, the backend uses SendGrid’s API to send a confirmation email to the customer.
16. **Email Notification**: The customer receives an email notification with the payment details and confirmation.
