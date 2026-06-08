원본 데이터베이스 가이드
------------------------

CMT는 8종의 원본 데이터를 CUBRID로 마이그레이션할 수 있다. 본 챕터는 각 원본 데이터베이스별로 연결 옵션과 마이그레이션 대상이 되는 객체를 정리한다.

각 절은 동일한 구조를 따른다. 먼저 JDBC 연결에 필요한 정보(드라이버 클래스, 기본 포트, URL 형식)를 제시하고, 마이그레이션할 수 있는 객체 종류를 나열한다. 데이터 타입 매핑의 전체 표는 :doc:`appendix_typemap`\에 별도로 정리되어 있다.

공통 사항
^^^^^^^^^

모든 원본 DB에 공통적으로 적용되는 항목이다.

JDBC 드라이버
"""""""""""""

CMT는 JDBC를 사용해 원본 DB에 접속한다. CUBRID JDBC 드라이버는 배포본에 번들로 포함되어 있지만, 그 외 DB(Oracle, MySQL, MariaDB, MSSQL, Informix, Tibero)는 사용자가 별도로 JDBC JAR을 준비해서 등록해야 한다.

연결 다이얼로그의 **JDBC 드라이버** 항목에서 JAR 파일을 지정하거나, 메뉴 **마이그레이션 > 기본 설정**\를 열고 좌측 트리의 **JDBC 드라이버** 페이지에서 미리 등록할 수 있다.

문자셋
""""""

연결 다이얼로그의 **문자 집합** 항목은 클라이언트가 데이터를 해석할 때 사용할 문자 집합을 지정한다. 기본값은 ``UTF-8``\이다. 원본 DB의 캐릭터셋과 클라이언트 문자셋이 다르면 문자 변환 과정에서 데이터 손실이 발생할 수 있으므로, 원본 DB의 캐릭터셋과 일치시키는 것을 권장한다.

타임존
""""""

시간 데이터를 읽고 쓸 때 **CMT를 실행하는 환경(JVM)의 타임존**\을 일관되게 사용한다. 원본에서 읽을 때와 대상 CUBRID에 쓸 때 동일한 타임존을 사용하므로, 타임존 정보가 없는 ``DATETIME`` / ``TIMESTAMP`` 값은 변환 없이 그대로 보존된다.

따라서 시간 데이터를 의도한 대로 옮기려면, **CMT를 실행하는 환경의 타임존을 원본 데이터가 기준으로 하는 타임존과 일치시키는 것**\을 권장한다.

JDBC 추가 파라미터
""""""""""""""""""

**JDBC 고급 설정...** 다이얼로그의 **JDBC URL** 항목에서 자동 생성된 URL을 보완할 수 있다. SSL 사용 여부, 연결 타임아웃, 서버 타임존 등 드라이버별 옵션을 ``key=value`` 형식으로 추가한다.

예시:

- ``useSSL=false&serverTimezone=UTC`` (MySQL)
- ``encrypt=false;trustServerCertificate=true`` (MSSQL)

권한 요구사항
"""""""""""""

원본 DB의 시스템 카탈로그/뷰를 조회해 객체 메타데이터를 수집한다. 대부분의 경우 **마이그레이션할 객체에 접근할 수 있는 일반 계정**\으로 충분하며, 자기 소유 객체는 별도 권한 부여 없이 조회된다. 다른 사용자/스키마의 객체를 마이그레이션하려면 해당 객체에 대한 ``SELECT`` 권한을 받아야 한다.

연결 검증
"""""""""

연결 다이얼로그의 **테스트** 버튼을 사용해 입력한 값으로 실제 접속이 가능한지 확인할 수 있다. 검증 실패 시 오류 메시지를 확인하고 호스트, 포트, 계정, JDBC 드라이버 경로를 점검한다.

CUBRID
^^^^^^

CUBRID 데이터베이스를 원본으로 지정하면 다른 CUBRID 데이터베이스로 데이터와 객체를 옮기는 마이그레이션을 수행할 수 있다.

연결 옵션 (CUBRID)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``cubrid.jdbc.driver.CUBRIDDriver``
    * - 기본 포트
      - ``33000``
    * - JDBC URL 형식
      - ``jdbc:cubrid:[host]:[port]:[database]:::``
    * - 번들 JDBC 드라이버
      - CUBRID 8.4.4 ~ 11.3.2 버전용 JDBC 드라이버가 배포본에 포함됨

JDBC URL 끝의 ``:::``\는 사용자/비밀번호 자리이며 연결 다이얼로그에서 입력한 값으로 대체된다. 원본 CUBRID 서버 버전에 맞는 JDBC 드라이버는 연결 다이얼로그 또는 기본 설정의 JDBC 드라이버 페이지에서 선택한다.

지원 객체 (CUBRID)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - CUBRID Serial
    * - Synonym
      - O
      - CUBRID 11.2 이상에서 마이그레이션. 11.2 미만에서는 추출되지 않는다
    * - Grant
      - O
      -
    * - Procedure
      - X
      - 
    * - Function
      - X
      - 

Synonym은 CUBRID 11.2부터 도입된 ``db_synonym`` 카탈로그를 기반으로 마이그레이션되며, 11.2 미만에서는 객체 자체가 존재하지 않아 추출 대상에서 제외된다.

Oracle
^^^^^^

Oracle을 원본으로 사용할 때 가장 광범위한 객체 종류와 PL/SQL 코드를 CUBRID로 옮길 수 있다.

연결 옵션 (Oracle)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``oracle.jdbc.OracleDriver``
    * - 기본 포트
      - ``1521``
    * - JDBC URL 형식
      - SID: ``jdbc:oracle:thin:@[host]:[port]:[SID]``
    * -
      - Service Name: ``jdbc:oracle:thin:@[host]:[port]/[SERVICE_NAME]``

연결 다이얼로그의 **데이터베이스 이름** 항목에 SID 또는 Service Name을 입력한다. Service Name(RAC 환경)을 사용하는 경우 URL 형식이 ``:`` 대신 ``/`` 구분자를 쓰므로, 자동 생성된 URL이 환경과 맞지 않으면 **JDBC URL** 필드에서 직접 수정한다.

다중 스키마를 지원하는 DB이므로 마법사 4단계 스키마 매핑에서 마이그레이션할 스키마를 선택할 수 있다.

지원 객체 (Oracle)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      - 비활성(``DISABLED``) 제약은 제외
    * - Foreign Key
      - O
      - 비활성(``DISABLED``) 제약은 제외
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - Oracle Sequence → CUBRID Serial
    * - Synonym
      - O
      -
    * - Grant
      - O
      -
    * - Procedure
      - O
      - 본문의 정적 SQL은 자동 변환되지 않음
    * - Function
      - O
      - 본문의 정적 SQL은 자동 변환되지 않음

자동 제외 항목
""""""""""""""

다음 시스템 Table은 마이그레이션 대상에서 자동으로 제외된다.

- ``MLOG$``\로 시작하는 Table (Materialized View Log)
- ``RUPD$``\로 시작하는 Table (Materialized View 갱신 메타데이터)
- ``BIN$``\로 시작하는 Table (Recycle Bin)

사용자 Table 이름이 이 패턴과 일치하면 마이그레이션 대상에서 빠지므로, 해당 이름을 사용하지 않도록 한다.

비활성 상태(``DISABLED``)의 Primary Key·Foreign Key 제약 조건도 마이그레이션 대상에서 제외된다. Oracle의 동작과 일치시키기 위한 것으로, 비활성 제약 조건은 DML 검증에 참여하지 않기 때문이다. 비활성 제약 조건도 옮기려면 원본 Oracle에서 미리 활성화한 뒤 마이그레이션을 수행한다.

기본 datetime 함수 변환
"""""""""""""""""""""""

Oracle의 ``DATE`` / ``TIMESTAMP`` Column에 지정된 기본값 함수는 CUBRID 등가 함수로 자동 변환된다.

.. list-table::
    :header-rows: 1
    :widths: 40 60

    * - Oracle
      - CUBRID
    * - ``SYSDATE``
      - ``sys_datetime``
    * - ``CURRENT_DATE``
      - ``current_datetime``
    * - ``TO_DATE(...)``
      - ``TO_DATETIME(...)`` (``DATETIME`` Column인 경우)

위 변환은 Column 기본값에만 적용되며, 일반 SQL 본문(예: View 정의, PL/SQL 본문) 내의 함수 호출은 변환되지 않는다. View나 PL/SQL 본문 안에 ``SYSDATE``\가 포함되어 있으면 마이그레이션 후 수동으로 검토하는 것을 권장한다.

PL/SQL 변환
"""""""""""

Oracle PL/SQL로 작성된 Procedure·Function은 CUBRID PL/CSQL로 변환되어 옮겨진다. CUBRID PL/CSQL은 PL/SQL과 문법이 유사하므로, CMT는 루틴을 구문 분석한 뒤 본문을 대체로 그대로 옮기고 데이터 타입 등 일부 토큰만 CUBRID에 맞게 치환한다.

CMT는 PL/SQL Procedure / Function의 본문 안에 포함된 정적 SQL 문에 대해 스키마명 치환, CUBRID 예약어 처리(``[ ]`` / ``" "`` 감싸기) 등을 자동으로 수행하지 않는다. 마이그레이션 후 사용자가 직접 검토해 수정해야 한다.

구문 분석에 실패한 루틴(예: Wrap된 루틴, 미지원 PRAGMA 사용 등)은 마이그레이션에서 제외되며 보고서에 실패 사유와 함께 기록된다. 객체 매핑 화면에서 해당 루틴을 선택하면 다음과 같은 오류 메시지가 표시된다.

.. code-block:: text

    -- PL/CSQL syntax error: line 1, column 14: wrapped not recognized
    -- This routine will be skipped during migration.

대응 방법:

- **Wrap된 루틴**: 원본 Oracle에서 ``DBMS_DDL.UNWRAP``\으로 풀거나 원본 소스 파일을 사용해 재배포
- **구문 오류**: 원본 Oracle에서 먼저 수정
- **미지원 구문**: 마이그레이션 후 CUBRID에서 수동으로 작성

MySQL
^^^^^

연결 옵션 (MySQL)
"""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``com.mysql.cj.jdbc.Driver`` (MySQL 8.0 이상)
    * -
      - ``org.gjt.mm.mysql.Driver`` (구버전 드라이버)
    * - 기본 포트
      - ``3306``
    * - JDBC URL 형식
      - ``jdbc:mysql://[host]:[port]/[database]``

문자셋, SSL, 타임존 등의 옵션은 **JDBC 고급 설정...** 다이얼로그의 **JDBC URL** 항목에 ``characterEncoding=UTF-8&useSSL=false&serverTimezone=UTC`` 형식으로 추가한다.

지원 객체 (MySQL)
"""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - ``AUTO_INCREMENT`` → CUBRID Serial
    * - Synonym
      - X
      - MySQL이 지원하지 않음
    * - Grant
      - X
      - 
    * - Procedure
      - X
      -
    * - Function
      - X
      -

MariaDB
^^^^^^^

MariaDB는 MySQL과 카탈로그·문법이 호환되어 같은 절차로 마이그레이션할 수 있다. 차이점만 정리한다.

연결 옵션 (MariaDB)
"""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``org.mariadb.jdbc.Driver``
    * - 기본 포트
      - ``3306``
    * - JDBC URL 형식
      - ``jdbc:mariadb://[host]:[port]/[database]``

MySQL JDBC 드라이버로 MariaDB에 접속할 수도 있으나, MariaDB 전용 드라이버 사용을 권장한다.

지원 객체 (MariaDB)
"""""""""""""""""""

지원 객체 목록은 MySQL과 동일한 규칙을 따른다. ``AUTO_INCREMENT``, ``ENUM`` / ``SET`` 타입 매핑 모두 MySQL과 같다.

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - ``AUTO_INCREMENT`` → CUBRID Serial
    * - Synonym
      - X
      - MariaDB가 지원하지 않음
    * - Grant
      - X
      - 
    * - Procedure
      - X
      -
    * - Function
      - X
      -

MSSQL
^^^^^

연결 옵션 (MSSQL)
"""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - Microsoft 드라이버: ``com.microsoft.sqlserver.jdbc.SQLServerDriver``
    * -
      - jTDS: ``net.sourceforge.jtds.jdbc.Driver``
    * - 기본 포트
      - ``1433``
    * - JDBC URL 형식
      - Microsoft: ``jdbc:sqlserver://[host]:[port];databaseName=[database]``
    * -
      - jTDS: ``jdbc:jtds:sqlserver://[host]:[port]/[database]``

지원 객체 (MSSQL)
"""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - ``IDENTITY`` Column → CUBRID Serial. ``CREATE SEQUENCE`` 객체는 별도로 추출되지 않음
    * - Synonym
      - O
      - ``sys.synonyms`` 기반으로 추출되어 CUBRID Synonym으로 마이그레이션
    * - Grant
      - X
      - 
    * - Procedure
      - X
      - 
    * - Function
      - X
      - 

다중 스키마 모델이며 Schema 단위로 객체를 선택해 마이그레이션할 수 있다.

View의 Query Spec(SELECT 문)에 사용된 스키마명, 예약어 등은 자동 변환되지 않으므로 마이그레이션 후 수동으로 검토해야 한다.

Informix
^^^^^^^^

연결 옵션 (Informix)
""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``com.informix.jdbc.IfxDriver``
    * - 기본 포트
      - ``9088``
    * - JDBC URL 형식
      - ``jdbc:informix-sqli://[host]:[port]/[database]:INFORMIXSERVER=[server]``

자동 생성되는 URL에는 ``INFORMIXSERVER=informix``\가 채워진다. 원본 Informix 서버 인스턴스 이름이 이와 다르면 **JDBC 고급 설정...** 다이얼로그의 **JDBC URL** 항목에서 ``INFORMIXSERVER`` 값을 직접 수정한다.

지원 객체 (Informix)
""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - 네이티브 Informix Sequence(``syssequences``) → CUBRID Serial.
    * - Synonym
      - X
      - 추출되지 않음
    * - Grant
      - X
      - 
    * - Procedure
      - X
      - 
    * - Function
      - X
      - 

Tibero
^^^^^^

Tibero는 Oracle 호환 데이터베이스이며 마이그레이션 절차도 Oracle과 유사하다.

연결 옵션 (Tibero)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 항목
      - 값
    * - JDBC Driver 클래스
      - ``com.tmax.tibero.jdbc.TbDriver``
    * - 기본 포트
      - ``8629``
    * - JDBC URL 형식
      - ``jdbc:tibero:thin:@[host]:[port]:[SID]``

지원 객체 (Tibero)
""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 15 60

    * - 객체
      - 지원
      - 비고
    * - Table
      - O
      - DDL 및 데이터
    * - Primary Key
      - O
      -
    * - Foreign Key
      - O
      -
    * - Index
      - O
      -
    * - View
      - O
      - Query Spec 자동 변환은 적용되지 않음
    * - Sequence/Serial
      - O
      - Tibero Sequence → CUBRID Serial
    * - Synonym
      - O
      -
    * - Grant
      - O
      -
    * - Procedure
      - O
      - 본문의 정적 SQL은 자동 변환되지 않음
    * - Function
      - O
      - 본문의 정적 SQL은 자동 변환되지 않음

Tibero PL/SQL 변환
""""""""""""""""""""

Tibero의 PL/SQL은 Oracle PL/SQL과 동일한 변환 엔진으로 처리되어 CUBRID PL/CSQL로 옮겨진다. 변환 규칙과 실패 시 동작은 Oracle 절의 PL/SQL 변환을 참고한다.

CMT는 PL/SQL Procedure / Function의 본문 안에 포함된 정적 SQL 문에 대해 스키마명 치환, CUBRID 예약어 처리(``[ ]`` / ``" "`` 감싸기) 등을 자동으로 수행하지 않는다. 마이그레이션 후 사용자가 직접 검토해 수정해야 한다.

MySQL XML dump
^^^^^^^^^^^^^^

원본 DB에 직접 접속할 수 없는 환경에서, ``mysqldump --xml``\로 미리 생성해 둔 XML 덤프 파일을 입력으로 사용할 수 있다. 올바른 형식의 덤프 파일이 준비되어 있다고 가정한다. 마법사에서 원본 유형으로 선택하고 XML 파일 경로·문자집합을 지정하는 방법은 :doc:`05_wizard`\를 참고한다.

제약사항
""""""""

XML 덤프에 포함된 정보만 마이그레이션할 수 있으므로 다음 항목은 지원하지 않는다.

- Procedure
- Foreign Key
- View

Primary Key와 Index(``<key>`` 요소), Column 타입, NOT NULL 같은 ``<table_structure>`` 안에 포함된 정보는 보존된다.

XML 덤프 마이그레이션은 일시 정지 후 재시작 시나리오를 지원한다. 저장된 마이그레이션 템플릿에서 다시 시작하면 원본 카탈로그 정보가 XML 파일에서 복원되며, 활성 DB 연결 없이도 진행할 수 있다.

관련 챕터
^^^^^^^^^

- :doc:`05_wizard` — 마이그레이션 마법사 단계별 안내
- :doc:`06_objects` — 객체 유형별 매핑 옵션
- :doc:`08_target` — 대상 데이터베이스 / 출력 형식
- :doc:`appendix_typemap` — 원본 DB별 데이터 타입 전체 매핑 표
