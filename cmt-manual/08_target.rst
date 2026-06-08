대상 타입 가이드
----------------

본 챕터는 CMT가 지원하는 다섯 가지 대상(target) 출력 형식을 한곳에 모아 설명한다. 각 형식이 만드는 산출물, 후속 적재 도구, 실행 흐름, 그리고 선택 시 고려할 제약 사항을 정리한다. 1단계에서 어떤 대상을 고를지 결정할 때나 이미 생성된 출력 파일을 후속 도구로 다룰 때 참고한다.

마법사에서 대상을 선택하는 절차는 :doc:`05_wizard`\을, 객체별 매핑 옵션은 :doc:`06_objects`\을 참고한다. 본 챕터는 형식별 특성에만 집중한다.

대상 타입 비교
^^^^^^^^^^^^^^

대상은 크게 "운영 중인 CUBRID에 직접 적재"와 "파일로 저장"으로 나뉜다.

.. list-table:: 대상 타입 비교
    :header-rows: 1
    :widths: 18 22 18 24

    * - 대상
      - 산출물
      - 적재 도구
      - 주요 용도
    * - Online CUBRID
      - 없음 (DB에 직접 적재)
      - 불필요
      - 운영 이관, 실시간 적재
    * - CUBRID dump
      - loaddb 헤더 데이터 + 스키마 DDL
      - ``loaddb``
      - 대용량 적재, 원격 호스트 적재
    * - SQL 스크립트
      - ``.sql`` (DDL / 데이터 분리)
      - ``csql``
      - 검토·수정 후 적재, 버전 관리
    * - CSV
      - Table별 ``.csv`` + 스키마 ``.sql``
      - ``csql`` (스키마) + 외부 도구 (데이터)
      - 외부 도구 연계, 데이터 확인
    * - XLS
      - Table별 ``.xls`` 파일 + 스키마 ``.sql``
      - ``csql`` (스키마) + 외부 도구 (데이터)
      - 검토, 외부 공유, 소규모 데이터

.. image:: ./cmt_images/image_target_1.png

대상 유형은 모두 6단계 **확인** 화면에서 변경 없이 그대로 진행되거나, 이전 단계로 돌아가 변경할 수 있다.

Online CUBRID
^^^^^^^^^^^^^

운영 중인 CUBRID에 JDBC로 접속해 객체와 데이터를 직접 적재하는 모드이다. 파일 산출 없이 마이그레이션이 끝나면 대상 DB가 즉시 사용 가능한 상태가 된다.

**실행 흐름**
""""""""""""""""""""""""""""""""""""""""""""""""

다음 순서로 수행된다.

1. **스키마 생성** — 대상이 멀티 스키마이고 ``user schema 추가`` 옵션이 켜져 있으면 ``CREATE SCHEMA``\부터 실행한다.
2. **DDL (Table / View / Serial / Synonym)** — Table 과 View 등의 DDL을 데이터 적재 전에 실행한다. Primary Key·Index·Foreign Key 는 이 단계가 아니라 데이터 적재 이후에 생성된다(아래 4단계).
3. **데이터 적재** — Prepared Statement 기반의 배치 INSERT로 행을 적재한다. 내부적으로 export 스레드와 import 스레드가 분리돼 병렬로 동작한다.
4. **제약 조건 / Index** — Primary Key, 일반 Index, Foreign Key는 데이터 적재 이후에 생성된다. ``create_constraints_before_data`` 옵션을 켜면 Primary Key만 데이터 적재 전에 생성되며, Foreign Key는 옵션과 무관하게 항상 데이터 적재 이후에 생성된다.
5. **Procedure / Function** (Oracle / Tibero 원본 한정) — 데이터 적재가 끝난 뒤 PL/CSQL 객체를 생성한다.
6. **Grant** — 데이터 적재 이후에 생성된다.

**커밋 모델**
""""""""""""""""""""""""""""""""""""""""""""""""

- 데이터 적재 트랜잭션은 auto-commit을 끄고 ``commit_count``\에 도달할 때마다 커밋한다(기본 1000행).
- 커밋 단위는 Table별로 독립적이며 한 Table의 실패가 다른 Table의 진행을 막지 않는다.
- 메모리 사용량이 임계값을 넘으면 다음 커밋이 앞당겨진다.

**중간 실패와 재시작**
""""""""""""""""""""""""""""""""""""""""""""""""

마이그레이션이 사용자에 의해 취소되거나 일부 Table에서 실패한 경우, 보고서 화면 또는 마이그레이션 이력 화면에서 동일한 설정으로 다시 시작할 수 있다. 자세한 절차는 :doc:`10_report`\을 참고한다.

적재 중 실패한 행은 3단계 **대상 선택** 페이지의 **입력 실패 데이터 로그 파일로 저장** 옵션을 켜면 ``<설치 경로>/workspace/cmt/errors/<타임스탬프>/`` 아래에 원본 Table별 SQL 파일로 저장된다.

**대상 CUBRID 버전 자동 감지**
""""""""""""""""""""""""""""""""""""""""""""""""

Online CUBRID 대상에서는 사용자가 대상 버전을 선택하지 않는다. 마법사가 접속한 CUBRID 서버의 카탈로그 버전을 자동으로 감지해 대상 버전으로 설정하며, 별도의 버전 선택 UI는 표시되지 않는다.

**대상 CUBRID 버전별 차이**
""""""""""""""""""""""""""""""""""""""""""""""""

대상 CUBRID 버전에 따라 사용 가능한 기능과 권한 모델이 달라진다.

.. list-table::
    :header-rows: 1
    :widths: 20 80

    * - 대상 버전
      - 동작
    * - 11.0
      - 단일 스키마 모델. Synonym, Grant 객체 적재 불가.
    * - 11.2 이상
      - 멀티 스키마 모델. ``user schema 추가``\로 사용자 스키마를 분리해 적재 가능. Synonym, Grant 객체 지원.

.. note::
   ``GRANT`` 생성 여부는 대상 버전뿐만 아니라 **대상 접속 사용자가 DBA 그룹에 속해 있는지**\도 확인한다.

대상 버전 설정은 마법사 **3단계 대상 선택** 페이지에서 이루어진다.

- **온라인 CUBRID** 대상: 연결한 서버의 카탈로그 버전이 자동으로 채택된다. 사용자가 선택할 항목은 없다.
- **CUBRID dump / SQL / CSV / XLS 등 파일 대상**: 같은 페이지의 **CUBRID 버전:** 항목에서 ``11.2 이상`` 또는 ``11.0 이하`` 중 하나를 선택한다. 선택 결과는 위 표의 동작 차이로 이어진다.

파일 출력 공통 사항
^^^^^^^^^^^^^^^^^^^

CUBRID dump, SQL 스크립트, CSV, XLS 등 파일을 생성하는 모든 대상은 동일한 디렉토리 규칙과 파일명 규칙을 따른다. 본 절에서 공통 규칙을 정리하고, 이후 각 대상 절에서는 그 위에 얹히는 형식 고유 사항만 다룬다.

**출력 루트**

파일 출력 대상의 모든 산출물은 다음 경로 아래에 생성된다.

::

    <파일 저장소>/<마이그레이션 이름>/

- ``<파일 저장소>`` 는 마법사 3단계 **대상 선택** 페이지의 **파일 경로** 항목에서 지정한다.
- ``<마이그레이션 이름>`` 은 마법사 6단계 Confirmation 화면에서 지정한 마이그레이션 이름이다.

**스키마별 하위 디렉토리**

스키마/객체 산출물은 원본 스키마 이름의 하위 디렉토리에 묶인다.

::

    <파일 저장소>/<마이그레이션 이름>/<원본 스키마>/

데이터 파일도 별도 디렉토리로 분리되지 않고 같은 ``<원본 스키마>/`` 디렉토리 아래에 들어간다. 단, **Table당 파일 분리 (one_table_one_file)** 옵션을 켜면 데이터 파일만 한 단계 더 들어간 ``<원본 스키마>/objects/`` 아래에 생성된다. CSV 와 XLS 대상은 이 옵션 값과 무관하게 출력 동작상 항상 Table별 파일을 사용하므로 데이터 파일이 ``<원본 스키마>/objects/`` 아래에 놓인다.

**파일명 규칙**

각 파일명은 다음과 같이 조립된다.

::

    <접두사>_<원본 스키마>_<타입>[.확장자]

- ``<접두사>`` 는 3단계 **대상 선택** 페이지의 **출력 파일의 Prefix** 값이다(미지정 시 기본값 사용).
- ``<원본 스키마>`` 는 산출물이 속한 원본 DB의 스키마 이름이다.
- ``<타입>`` 은 객체 종류를 나타내는 고정 토큰이다(아래 표 참고).
- ``<확장자>`` 는 대상 출력 형식에 따라 달라진다.

**타입 토큰**

.. list-table::
    :header-rows: 1
    :widths: 28 72

    * - 타입 토큰
      - 내용
    * - ``class``
      - Table DDL
    * - ``vclass``
      - View DDL
    * - ``vclass_query_spec``
      - View 의 query spec
    * - ``pk``
      - Primary Key
    * - ``fk``
      - Foreign Key
    * - ``uk``
      - Unique Index (Primary Key 가 아닌 unique key)
    * - ``indexes``
      - 일반 Index
    * - ``serial``
      - Serial 정의
    * - ``synonym``
      - Synonym
    * - ``procedure``, ``function``
      - PL/CSQL 본문
    * - ``procedure_header``, ``function_header``
      - PL/CSQL 헤더 (시그니처)
    * - ``grant.<객체 소유자>``
      - Grant 산출물. 객체 소유자별로 파일이 하나씩 생성된다.
    * - ``info``
      - 적재 순서/메타정보 매니페스트
    * - ``object``
      - 데이터 (한 스키마의 모든 Table 데이터를 하나의 파일로 병합)
    * - ``<테이블>``
      - 데이터 (Table당 별도 파일, ``one_table_one_file=yes`` 일 때)

**확장자**

확장자는 대상 출력 형식과 파일 종류(스키마/데이터)에 따라 결정된다.

.. list-table::
    :header-rows: 1
    :widths: 22 26 26 26

    * - 대상
      - 스키마 파일
      - 데이터 파일
      - Grant 파일
    * - CUBRID dump
      - 확장자 없음
      - 확장자 없음
      - ``.<객체 소유자>``
    * - SQL 스크립트
      - ``.sql``
      - ``.sql``
      - ``_<객체 소유자>.sql``
    * - CSV
      - ``.sql``
      - ``.csv``
      - ``_<객체 소유자>.sql``
    * - XLS
      - ``.sql``
      - ``.xls``
      - ``_<객체 소유자>.sql``

**LOB 경로**

BLOB / CLOB Column은 dump 데이터 파일 안에 직접 쓰이지 않고, 별도 파일로 생성된다. 기본 경로는 다음과 같다.

::

    <파일 저장소>/<마이그레이션 이름>/lob/

데이터 파일에는 LOB 파일의 경로가 기록된다. 마법사 3단계 **대상 선택** 페이지의 **LOB files' root path** 를 비워 두면 위 기본 경로가 기록되고, 값을 지정하면 ``<지정 경로>/lob/<테이블명>/`` 형식의 경로가 기록된다. 이 옵션은 ``loaddb`` 가 LOB 파일을 찾을 위치를 데이터 파일에 적는 용도이므로, 대상 서버에서 다른 경로를 사용할 경우 생성된 LOB 파일도 그 위치에 맞게 배치한다.

**출력 예시 (전체 객체)**

모든 객체가 출력되었을 때의 디렉토리 구조는 다음과 같다(CUBRID dump 대상, 접두사 ``demodb`` / 원본 스키마 ``public`` 기준). SQL · CSV · XLS 대상도 데이터 파일의 확장자와 형식만 다를 뿐 같은 구조를 따른다.

::

    <파일 저장소>/<마이그레이션 이름>/
    ├── create_user.sql                       # 유저 생성 쿼리 출력 옵션 활성 시 (마이그레이션 루트)
    ├── public/
    │   ├── demodb_public_class
    │   ├── demodb_public_pk
    │   ├── demodb_public_fk
    │   ├── demodb_public_indexes
    │   ├── demodb_public_uk
    │   ├── demodb_public_serial
    │   ├── demodb_public_vclass
    │   ├── demodb_public_vclass_query_spec
    │   ├── demodb_public_procedure
    │   ├── demodb_public_procedure_header
    │   ├── demodb_public_function
    │   ├── demodb_public_function_header
    │   ├── demodb_public_synonym
    │   ├── demodb_public_grant.appuser
    │   ├── demodb_public_info
    │   ├── demodb_public_updatestatistic
    │   ├── demodb_public_object              # one_table_one_file=no
    │   └── objects/                          # one_table_one_file=yes
    │       ├── demodb_public_nation
    │       └── demodb_public_city
    └── lob/
        └── ...

``create_user.sql``\은 마법사 3단계의 **유저 생성 쿼리 출력** 옵션을 켰을 때만, 스키마별 하위 디렉토리가 아닌 마이그레이션 루트에 단일 파일로 생성된다.

CUBRID dump (loaddb)
^^^^^^^^^^^^^^^^^^^^

CUBRID의 ``loaddb`` 유틸리티가 직접 적재할 수 있는 dump 파일 묶음을 만드는 모드이다. 대용량 적재나, 원본 환경에서 산출한 뒤 별도 호스트에서 적재하는 시나리오에 적합하다.

**산출 파일**
""""""""""""""""""""""""""""""""""""""""""""""""

출력은 ``<파일 저장소>/<마이그레이션 이름>/<원본 스키마>/`` 아래에 생성된다. 모든 파일은 확장자가 없으며, Grant 파일만 ``.<객체 소유자>`` 형태의 확장자가 붙는다.

스키마/객체 파일:

- ``<접두사>_<스키마>_class`` — Table DDL
- ``<접두사>_<스키마>_pk`` — Primary Key
- ``<접두사>_<스키마>_fk`` — Foreign Key
- ``<접두사>_<스키마>_indexes`` — 일반 Index
- ``<접두사>_<스키마>_uk`` — Unique Index (PK 가 아닌 unique key)
- ``<접두사>_<스키마>_serial`` — Serial 정의
- ``<접두사>_<스키마>_vclass`` — View DDL
- ``<접두사>_<스키마>_vclass_query_spec`` — View 의 query spec
- ``<접두사>_<스키마>_procedure``, ``<접두사>_<스키마>_function`` — PL/CSQL 본문
- ``<접두사>_<스키마>_procedure_header`` — PL/CSQL Procedure 헤더 (인터페이스 선언)
- ``<접두사>_<스키마>_function_header`` — PL/CSQL Function 헤더 (인터페이스 선언)
- ``<접두사>_<스키마>_synonym`` — Synonym
- ``<접두사>_<스키마>_grant.<객체 소유자>`` — Grant (객체 소유자별)
- ``<접두사>_<스키마>_info`` — 적재 순서를 정의하는 매니페스트

데이터 파일:

- ``<접두사>_<스키마>_object`` — 한 스키마의 모든 데이터를 하나로 병합 (기본)
- ``objects/<접두사>_<스키마>_<테이블>`` — Table별로 파일을 분리할 때 (``one_table_one_file=yes``)

**LOB 경로**
""""""""""""""""""""""""""""""""""""""""""""""""

BLOB / CLOB Column이 포함된 Table은 마이그레이션 루트 디렉토리 하위에 별도의 ``lob/`` 디렉토리를 만들고 파일을 생성한다. 데이터 파일에는 LOB 파일 경로가 기록된다.

::

    <파일 저장소>/<마이그레이션 이름>/
    └── lob/
        └── ...     # 하위 디렉토리 깊이는 파일 수에 따라 자동 결정

SQL 스크립트
^^^^^^^^^^^^

DDL과 ``INSERT`` 문을 그대로 담은 ``.sql`` 파일 묶음을 만든다. 사람이 직접 검토·수정한 뒤 적용하거나, 변경 이력을 형상 관리 도구에 보관하기 좋은 형식이다.

**산출 파일**
""""""""""""""""""""""""""""""""""""""""""""""""

모든 파일이 ``.sql`` 확장자를 가지며, ``<파일 저장소>/<마이그레이션 이름>/<원본 스키마>/`` 아래에 생성된다. 객체 종류별 파일 분리는 dump 모드와 동일하다.

- ``<접두사>_<스키마>_class.sql`` — Table DDL
- ``<접두사>_<스키마>_pk.sql`` — Primary Key
- ``<접두사>_<스키마>_fk.sql`` — Foreign Key
- ``<접두사>_<스키마>_indexes.sql`` — 일반 Index
- ``<접두사>_<스키마>_uk.sql`` — Unique Index
- ``<접두사>_<스키마>_serial.sql`` — Serial 정의
- ``<접두사>_<스키마>_vclass.sql``, ``<접두사>_<스키마>_vclass_query_spec.sql`` — View
- ``<접두사>_<스키마>_procedure.sql``, ``<접두사>_<스키마>_function.sql`` — PL/CSQL
- ``<접두사>_<스키마>_procedure_header.sql`` — PL/CSQL Procedure 헤더 (인터페이스 선언)
- ``<접두사>_<스키마>_function_header.sql`` — PL/CSQL Function 헤더 (인터페이스 선언)
- ``<접두사>_<스키마>_synonym.sql`` — Synonym
- ``<접두사>_<스키마>_grant_<객체 소유자>.sql`` — Grant
- ``<접두사>_<스키마>_info.sql`` — 매니페스트

데이터 파일:

- ``<접두사>_<스키마>_object.sql`` — 한 스키마의 데이터를 하나로 병합 (기본)
- ``objects/<접두사>_<스키마>_<테이블>.sql`` — Table별 데이터 (``one_table_one_file=yes``)

데이터 파일은 ``one_table_one_file`` 옵션과 ``maxCountPerFile`` (파일당 최대 행 수) 기준으로 나뉜다. ``commit_count``\는 적재 커밋 주기이며 파일 분할과는 무관하다.

**파일 포맷**
""""""""""""""""""""""""""""""""""""""""""""""""

.. code-block:: sql

    -- cmt_demodb_class.sql
    CREATE TABLE "nation" (
      "code"      CHAR(3)      NOT NULL,
      "name"      VARCHAR(40)  NOT NULL,
      "continent" VARCHAR(20),
      "capital"   VARCHAR(40),
      PRIMARY KEY ("code")
    );

식별자는 큰따옴표로, 문자열 리터럴은 작은따옴표로 감싼다. 작은따옴표는 ``''``\로 이스케이프된다.

**csql 적재 예시**
""""""""""""""""""""""""""""""""""""""""""""""""

.. code-block:: bash

    cd <파일 저장소>/<마이그레이션 이름>/demodb
    csql -u dba targetdb -i cmt_demodb_class.sql
    csql -u dba targetdb -i cmt_demodb_object.sql
    csql -u dba targetdb -i cmt_demodb_fk.sql

큰 Table의 ``INSERT`` 적재는 ``loaddb``\보다 느리므로, 데이터 규모가 크면 SQL 대신 CUBRID dump를 권한다.

CSV
^^^^

Table별로 표준 CSV 파일을 만들고, 스키마와 제약 조건은 별도의 ``.sql`` 파일로 저장하는 모드이다. 외부 ETL 도구나 BI 도구로 데이터를 옮길 때 적합하다.

**산출 파일**
""""""""""""""""""""""""""""""""""""""""""""""""

스키마/객체 파일은 SQL 모드와 동일한 이름·위치를 사용하지만, 데이터 파일만 ``.csv`` 확장자로 출력된다.

::

    <파일 저장소>/<마이그레이션 이름>/
    └── demodb/
        ├── cmt_demodb_class.sql
        ├── cmt_demodb_pk.sql
        ├── cmt_demodb_fk.sql
        ├── cmt_demodb_indexes.sql
        ├── cmt_demodb_uk.sql
        ├── cmt_demodb_serial.sql
        ├── cmt_demodb_info.sql
        └── objects/                                 # CSV 는 항상 Table별 파일로 출력
            ├── cmt_demodb_nation.csv
            └── cmt_demodb_city.csv

CSV 대상은 마법사 3단계에서 ``one_table_one_file`` 체크박스가 표시되지 않으며, 출력 동작상 항상 Table별 파일을 사용한다. 따라서 데이터 파일은 한 스키마의 모든 Table을 묶은 ``object.csv`` 로 만들어지지 않고, 항상 Table당 별도 ``.csv`` 파일로 출력된다.

**CSV 포맷**
""""""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 28 22 50

    * - 항목
      - 기본값
      - 설명
    * - **구분자**
      - ``,``
      - Column 구분자. 출력 옵션에서 변경 가능
    * - **따옴표 문자**
      - ``"``
      - 문자열 감싸기 문자
    * - **이스케이프 문자**
      - 사용 안 함 (``CSV_NO_CHAR``)
      - 따옴표·구분자 이스케이프 문자. 기본값은 비활성이며, 설정에서 명시적으로 지정해야 동작한다.
    * - **헤더 행**
      - 없음
      - CSV 출력에는 Column 헤더 행이 작성되지 않는다. 첫 행부터 데이터 행이다.
    * - **문자집합**
      - UTF-8
      - 출력 파일 인코딩. 설정에서 변경 가능
    * - **NULL 출력 표기**
      - ``NULL``
      - CMT가 CSV로 출력할 때 NULL 값은 ``NULL`` 리터럴로 기록된다.
    * - **NULL로 인식하는 입력 토큰**
      - ``\N``, ``NULL``, ``(NULL)``
      - 생성된 CSV를 다시 읽어 들일 때, 이 세 가지 토큰을 NULL로 해석한다.

문자열 안에 구분자·따옴표·줄바꿈이 포함되면 따옴표로 감싸지고, 이스케이프 규약에 따라 내부 따옴표가 처리된다.

XLS
^^^^^^^^^^

Microsoft Excel 파일(``.xls``)을 만든다. 사람이 직접 데이터를 검토하거나 일부만 추려 외부 공유할 때 유용하다.

**산출 파일**
""""""""""""""""""""""""""""""""""""""""""""""""

::

    <파일 저장소>/<마이그레이션 이름>/
    └── demodb/
        ├── cmt_demodb_class.sql
        ├── cmt_demodb_pk.sql
        ├── cmt_demodb_fk.sql
        ├── cmt_demodb_indexes.sql
        ├── cmt_demodb_uk.sql
        ├── cmt_demodb_serial.sql
        ├── cmt_demodb_info.sql
        └── objects/                                 # XLS 는 항상 Table별 파일로 출력
            ├── cmt_demodb_nation.xls
            └── cmt_demodb_city.xls

XLS 대상도 CSV와 마찬가지로 마법사 3단계에서 ``one_table_one_file`` 체크박스가 표시되지 않으며, 출력 동작상 항상 Table별 파일을 사용한다. 따라서 한 ``.xls`` 파일에 여러 Table을 시트로 묶지 않고, 항상 Table당 별도 ``.xls`` 파일로 출력된다.

**시트 구조**
""""""""""""""""""""""""""""""""""""""""""""""""

- ``.xls`` 파일 하나가 Table 하나에 대응하며, 시트는 항상 하나이다. 행 수가 상한을 넘으면 시트를 나누지 않고 별도의 XLS 파일이 추가로 생성된다(아래 "행 수 제한" 참고).
- 시트 이름은 Table 이름이며, Excel 제한에 따라 31자로 잘릴 수 있다.
- 첫 행부터 데이터 행이 채워지며, Column 헤더 행은 작성되지 않는다.
- 모든 셀은 ``jxl.write.Label`` (문자열 셀)로 기록된다. Column 데이터 타입에 따라 셀 타입을 텍스트 / 숫자 / 날짜로 구분 매핑하지는 않는다.
- 한 셀에 들어가는 문자열 길이가 **32,767자** (``MAX_EXCEL_CELL_LENGTH``)를 넘으면 해당 셀은 빈 문자열로 기록된다.

**행 수 제한**
""""""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 30 30 40

    * - 형식
      - 파일당 최대 행 수
      - 초과 시
    * - XLS
      - 65,536
      - 행 수 초과 시 별도 XLS 파일로 분할

행 수가 상한(``XLS_MAX_COUNT=65536``)을 넘으면 같은 Table이 여러 XLS 파일로 나뉜다(한 ``.xls`` 파일 안에서 여러 시트로 나누는 것이 아니라 파일 자체가 추가로 생성된다).

관련 챕터
^^^^^^^^^

- :doc:`05_wizard` — 대상 유형 선택 절차
- :doc:`06_objects` — 객체별 매핑 옵션
- :doc:`10_report` — 보고서·로그·재실행
