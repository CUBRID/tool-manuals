:meta-keywords: cubrid migration toolkit, cmt, data type mapping, type mapping, cubrid, oracle, mysql, mariadb, mssql, informix, tibero
:meta-description: CMT가 8개 원본 데이터베이스(CUBRID/Oracle/MySQL/MariaDB/MSSQL/Informix/Tibero/MySQL XML dump)의 데이터 타입을 CUBRID 데이터 타입으로 매핑하는 기본 규칙을 정리한 레퍼런스.

부록 A. 데이터 타입 매핑
---------------------------------------------

본 부록은 CMT가 8개 원본 데이터베이스의 컬럼 데이터 타입을 CUBRID 데이터 타입으로 변환할 때 사용하는 **기본 매핑** 을 한 곳에 정리한 레퍼런스이다. 본문 :doc:`07_sourcedb`\에서 각 원본 DB의 특이 사항을 다루며, 매핑 전체표가 필요한 경우 본 부록을 참조한다.

표의 컬럼은 다음과 같다.

- **원본 데이터 타입** / **전체 자릿수** / **소수점 이하 자릿수**
- **대상 데이터 타입** / **전체 자릿수** / **소수점 이하 자릿수**

표기 규약:

- ``n``, ``p``, ``s``\은 사용자가 원본에서 지정한 값을 그대로 전달함을 의미한다 (``n`` = length/precision, ``p`` = precision, ``s`` = scale).
- 빈 칸은 해당 자릿수가 명시되지 않거나 데이터 타입의 정의에서 결정됨을 의미한다.
- 하나의 원본 타입에 여러 대상 후보가 있는 경우(예: ``int`` → ``int``, ``bigint``, ``numeric``, ``varchar``) **기본값** 만 본 표에 표기한다. 다른 후보로의 변경은 :doc:`11_config`\의 **데이터 타입 매핑 편집** 절 또는 마법사 **타입 매핑** 화면에서 선택할 수 있다.

A.1 CUBRID → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 22 12 12 22 12 12

    ``short``, , , ``short``, ,
    ``int``, , , ``int``, ,
    ``bigint``, , , ``bigint``, ,
    ``numeric``, p, s, ``numeric``, p, s
    ``float``, , , ``float``, ,
    ``double``, , , ``double``, ,
    ``monetary``, , , ``numeric``, 38, 2
    ``char``, n, , ``char``, n,
    ``varchar``, n, , ``varchar``, n,
    ``nchar``, n, , ``char``, n,
    ``nvarchar``, n, , ``varchar``, n,
    ``date``, , , ``date``, ,
    ``time``, , , ``time``, ,
    ``datetime``, , , ``datetime``, ,
    ``timestamp``, , , ``timestamp``, ,
    ``datetimetz``, , , ``datetimetz``, ,
    ``datetimeltz``, , , ``datetimeltz``, ,
    ``timestamptz``, , , ``timestamptz``, ,
    ``timestampltz``, , , ``timestampltz``, ,
    ``bit``, n, , ``bit``, n,
    ``bit varying``, n, , ``bit varying``, n,
    ``blob``, , , ``bit varying``, 1073741823,
    ``clob``, , , ``varchar``, 1073741823,
    ``glo``, , , ``bit varying``, 1073741823,
    ``set``, , , ``set``, ,
    ``multiset``, , , ``multiset``, ,
    ``list``, , , ``list``, ,
    ``enum``, , , ``enum``, ,
    ``json``, , , ``json``, ,

A.2 Oracle → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 28 10 12 22 14 14

    ``BFILE``, , , ``blob``, ,
    ``BLOB``, , , ``bit varying``, 1073741823,
    ``RAW``, n, , ``bit varying``, n,
    ``LONG RAW``, , , ``bit varying``, 1073741823,
    ``LONG``, , , ``varchar``, 1073741823,
    ``CHAR``, n, , ``char``, n,
    ``VARCHAR2``, n, , ``varchar``, n,
    ``NCHAR``, n, , ``char``, n,
    ``NVARCHAR2``, n, , ``varchar``, n,
    ``CLOB``, , , ``varchar``, 1073741823,
    ``NCLOB``, , , ``varchar``, 1073741823,
    ``BINARY_DOUBLE``, , , ``double``, ,
    ``BINARY_FLOAT``, , , ``float``, ,
    ``DECIMAL``, p, s, ``numeric``, p, s
    ``INTEGER``, , , ``int``, ,
    ``FLOAT``, , , ``double``, ,
    ``REAL``, , , ``float``, ,
    ``NUMBER``, , , ``numeric``, 38, 15
    ``NUMBER``, p, s, ``numeric``, p, s
    ``DATE``, , , ``datetime``, ,
    ``TIMESTAMP``, , , ``timestamp``, ,
    ``TIMESTAMP WITH TIME ZONE``, , , ``varchar``, 100,
    ``TIMESTAMP WITH LOCAL TIME ZONE``, , , ``datetime``, ,
    ``INTERVAL DAY TO SECOND``, , , ``varchar``, 255,
    ``INTERVAL YEAR TO MONTH``, , , ``varchar``, 255,
    ``ROWID``, , , ``varchar``, 64,
    ``UROWID``, , , ``varchar``, 4000,
    ``ARRAY``, , , ``list(varchar)``, 255,

A.3 MySQL → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 24 12 12 22 14 14

    ``bit``, 1, , ``short``, ,
    ``bit``, n, , ``bit``, n,
    ``tinyint``, , , ``short``, ,
    ``tinyint unsigned``, , , ``short``, ,
    ``bool``, , , ``short``, ,
    ``boolean``, , , ``short``, ,
    ``smallint``, , , ``short``, ,
    ``smallint unsigned``, , , ``int``, ,
    ``mediumint``, , , ``int``, ,
    ``mediumint unsigned``, , , ``int``, ,
    ``int``, , , ``int``, ,
    ``int unsigned``, , , ``bigint``, ,
    ``bigint``, , , ``bigint``, ,
    ``bigint unsigned``, , , ``numeric``, 20,
    ``float``, , , ``float``, ,
    ``float unsigned``, , , ``float``, ,
    ``double``, , , ``double``, ,
    ``double unsigned``, , , ``double``, ,
    ``decimal``, p, s, ``numeric``, p, s
    ``decimal unsigned``, p, s, ``numeric``, p, s
    ``numeric``, p, s, ``numeric``, p, s
    ``date``, , , ``date``, ,
    ``datetime``, , , ``datetime``, ,
    ``timestamp``, , , ``timestamp``, ,
    ``time``, , , ``time``, ,
    ``year``, , , ``char``, 4,
    ``char``, n, , ``char``, n,
    ``varchar``, n, , ``varchar``, n,
    ``binary``, n, , ``bit``, n,
    ``varbinary``, n, , ``bit varying``, n,
    ``tinyblob``, , , ``bit varying``, 2040,
    ``tinytext``, , , ``varchar``, 255,
    ``blob``, , , ``bit varying``, 524280,
    ``text``, , , ``varchar``, 65535,
    ``mediumblob``, , , ``bit varying``, 1073741823,
    ``mediumtext``, , , ``varchar``, 16277215,
    ``longblob``, , , ``bit varying``, 1073741823,
    ``longtext``, , , ``varchar``, 1073741823,
    ``enum``, , , ``enum``, ,
    ``set``, , , ``set(varchar)``, 255,

A.4 MariaDB → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 24 12 12 22 14 14

    ``bit``, 1, , ``short``, ,
    ``bit``, n, , ``bit``, n,
    ``tinyint``, , , ``short``, ,
    ``tinyint unsigned``, , , ``short``, ,
    ``bool``, , , ``short``, ,
    ``boolean``, , , ``short``, ,
    ``smallint``, , , ``short``, ,
    ``smallint unsigned``, , , ``int``, ,
    ``mediumint``, , , ``int``, ,
    ``mediumint unsigned``, , , ``int``, ,
    ``int``, , , ``int``, ,
    ``int unsigned``, , , ``bigint``, ,
    ``bigint``, , , ``bigint``, ,
    ``bigint unsigned``, , , ``numeric``, 20,
    ``float``, , , ``float``, ,
    ``float unsigned``, , , ``float``, ,
    ``double``, , , ``double``, ,
    ``double unsigned``, , , ``double``, ,
    ``decimal``, p, s, ``numeric``, p, s
    ``decimal unsigned``, p, s, ``numeric``, p, s
    ``numeric``, p, s, ``numeric``, p, s
    ``date``, , , ``date``, ,
    ``datetime``, , , ``datetime``, ,
    ``timestamp``, , , ``timestamp``, ,
    ``time``, , , ``time``, ,
    ``year``, , , ``char``, 4,
    ``char``, n, , ``char``, n,
    ``varchar``, n, , ``varchar``, n,
    ``binary``, n, , ``bit``, n,
    ``varbinary``, n, , ``bit varying``, n,
    ``tinyblob``, , , ``bit varying``, 2040,
    ``tinytext``, , , ``varchar``, 255,
    ``blob``, , , ``bit varying``, 524280,
    ``text``, , , ``varchar``, 65535,
    ``mediumblob``, , , ``bit varying``, 1073741823,
    ``mediumtext``, , , ``varchar``, 16277215,
    ``longblob``, , , ``bit varying``, 1073741823,
    ``longtext``, , , ``varchar``, 1073741823,
    ``enum``, , , ``enum``, ,
    ``set``, , , ``set(varchar)``, 255,

A.5 MSSQL → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 22 12 12 22 14 14

    ``bit``, 1, , ``short``, ,
    ``tinyint``, , , ``short``, ,
    ``smallint``, , , ``short``, ,
    ``int``, , , ``int``, ,
    ``bigint``, , , ``bigint``, ,
    ``numeric``, p, s, ``numeric``, p, s
    ``decimal``, p, s, ``numeric``, p, s
    ``smallmoney``, , , ``numeric``, 10, 4
    ``money``, , , ``numeric``, 19, 4
    ``float``, , , ``float``, ,
    ``real``, , , ``float``, ,
    ``date``, , , ``date``, ,
    ``time``, , , ``time``, ,
    ``smalldatetime``, , , ``datetime``, ,
    ``datetime``, , , ``datetime``, ,
    ``datetime2``, , , ``datetime``, ,
    ``datetimeoffset``, , , ``varchar``, 34,
    ``timestamp``, , , ``bit varying``, 64,
    ``char``, n, , ``char``, n,
    ``varchar``, n, , ``varchar``, n,
    ``text``, , , ``varchar``, 1073741823,
    ``ntext``, , , ``varchar``, 1073741823,
    ``nvarchar``, n, , ``varchar``, n,
    ``nchar``, n, , ``char``, n,
    ``binary``, n, , ``bit``, n,
    ``varbinary``, n, , ``bit varying``, n,
    ``image``, , , ``bit varying``, 1073741823,
    ``hierarchyid``, , , ``bit varying``, 7136,
    ``geography``, , , ``bit varying``, 1073741823,
    ``geometry``, , , ``bit varying``, 1073741823,
    ``sql_variant``, , , ``varchar``, 8000,
    ``uniqueidentifier``, , , ``varchar``, 36,
    ``xml``, , , ``varchar``, 1073741823,
    ``sysname``, , , ``varchar``, 128,

A.6 Informix → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 22 12 12 24 14 14

    ``bigint``, , , ``bigint``, ,
    ``int8``, , , ``bigint``, ,
    ``bigserial``, , , ``bigint``, ,
    ``serial``, , , ``int``, ,
    ``serial8``, , , ``bigint``, ,
    ``smallint``, , , ``short``, ,
    ``integer``, , , ``int``, ,
    ``smallfloat``, , , ``float``, ,
    ``float``, n, , ``double``, ,
    ``decimal``, p, s, ``numeric``, p, s
    ``money``, p, s, ``numeric``, p, s
    ``boolean``, n, , ``int``, ,
    ``char``, n, , ``char``, n,
    ``nchar``, n, , ``char``, n,
    ``varchar``, n, , ``varchar``, n,
    ``nvarchar``, n, , ``varchar``, n,
    ``lvarchar``, n, , ``varchar``, n,
    ``text``, , , ``varchar``, 1073741823,
    ``clob``, n, , ``varchar``, 1073741823,
    ``blob``, n, , ``bit varying``, 1073741823,
    ``byte``, n, , ``bit varying``, n,
    ``date``, , , ``date``, ,
    ``datetime``, , , ``datetime``, ,
    ``interval``, , , ``varchar``, 255,
    ``bson``, n, , ``json``, n,
    ``json``, n, , ``json``, n,
    ``set``, , , ``set(varchar)``, 255,
    ``list``, , , ``list(varchar)``, 255,
    ``multiset``, , , ``multiset(varchar)``, 255,

A.7 Tibero → CUBRID
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. csv-table::
    :header: "원본 데이터 타입", "전체 자릿수", "소수점 이하", "대상 데이터 타입", "전체 자릿수", "소수점 이하"
    :widths: 28 10 12 22 14 14

    ``BINARY_DOUBLE``, , , ``double``, ,
    ``BINARY_FLOAT``, , , ``float``, ,
    ``BLOB``, , , ``bit varying``, 1073741823,
    ``CHAR``, n, , ``char``, n,
    ``CLOB``, , , ``varchar``, 1073741823,
    ``DATE``, , , ``datetime``, ,
    ``FLOAT``, , , ``numeric``, ,
    ``INTEGER``, , , ``numeric``, ,
    ``INTERVAL DAY TO SECOND``, , , ``varchar``, 64,
    ``INTERVAL YEAR TO MONTH``, , , ``varchar``, 16,
    ``JSON``, , , ``json``, ,
    ``LONG``, , , ``varchar``, 1073741823,
    ``LONG RAW``, , , ``bit varying``, 1073741823,
    ``NCHAR``, n, , ``char``, n,
    ``NCLOB``, , , ``varchar``, 1073741823,
    ``NUMBER``, , , ``numeric``, 38, 15
    ``NUMBER``, p, s, ``numeric``, p, s
    ``NVARCHAR``, n, , ``varchar``, n,
    ``NVARCHAR2``, n, , ``varchar``, n,
    ``RAW``, n, , ``bit varying``, n,
    ``ROWID``, , , ``varchar``, 32,
    ``TIME``, , , ``time``, ,
    ``TIMESTAMP``, , , ``datetime``, ,
    ``TIMESTAMP WITH LOCAL TIME ZONE``, , , ``datetimeltz``, ,
    ``TIMESTAMP WITH TIME ZONE``, , , ``datetimetz``, ,
    ``VARCHAR``, n, , ``varchar``, n,
    ``VARCHAR2``, n, , ``varchar``, n,
    ``XMLTYPE``, , , ``varchar``, 1073741823,
