콘솔(CLI) 가이드
----------------

본 챕터는 CMT의 콘솔(Console) 모드 사용법을 다룬다. GUI를 띄울 수 없는 서버 환경에서 마이그레이션을 실행하거나, 마이그레이션 스크립트를 일괄 생성할 때 콘솔을 사용한다.

콘솔 모드는 네 개의 하위 명령(``start``, ``script``, ``report``, ``log``)으로 구성된다.

.. note::
  콘솔 모드의 모든 출력(헬프, 오류 메시지, 진행률)은 영어로 표기된다. 본 매뉴얼의 명령 출력 예시는 실제 출력과 일치하도록 영문 원문 그대로 인용한다.

콘솔 개요
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

콘솔 모드는 GUI와 동일한 마이그레이션 엔진을 사용한다. 차이는 입력 방식과 사용자 상호작용에 있다.

설치 & 실행
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

콘솔은 GUI와 별도의 전용 패키지로 배포된다(콘솔: ``CUBRID-Migration-Toolkit-console-...-linux.tar.gz``, GUI: ``CUBRID-Migration-Toolkit-...-windows-x64.zip``). :doc:`02_install`\의 안내대로 설치하면 콘솔 실행 파일도 함께 설치된다.

실행 파일
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 20 30 50

    * - 운영 체제
      - 실행 파일
      - 위치
    * - Windows
      - ``migration.bat``
      - CMT 설치 디렉토리
    * - Linux
      - ``migration.sh``
      - CMT 설치 디렉토리

두 스크립트 모두 동봉된 JRE(``jre/bin/java``)를 호출하여 ``com.cubrid.cubridmigration.command-*.jar``\를 실행한다. 시스템에 별도로 Java를 설치할 필요는 없다.

환경 변수 / JVM 인자
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 25 25 50

    * - 항목
      - 기본값
      - 설명
    * - JVM 최소 힙
      - ``-Xms1024M`` (1GB)
      - 런처 스크립트에 하드코딩
    * - JVM 최대 힙
      - ``-Xmx4096M`` (4GB)
      - 대용량 DB 처리 시 ``migration.sh`` / ``migration.bat``\를 수정해 상향
    * - JRE 위치
      - ``$PWD/jre`` (Linux), ``%CD%\jre`` (Windows)
      - **현재 작업 디렉토리(cwd) 기준**\으로 해석된다.
    * - ``JAVA_HOME``
      - 사용하지 않음
      - 런처가 동봉된 JRE를 강제 사용
    * - 작업 디렉토리
      - 호출 시점의 현재 디렉토리(명령을 실행한 위치)
      - XML 스크립트와 ``-tp`` 경로도 이 디렉토리 기준으로 해석됨

.. tip::
  ``-Xmx`` 값으로 최대 힙 크기를 조정할 수 있으며, GUI 모드의 힙 조정은 :doc:`12_advanced`\을 참고한다.

헬프 보기
""""""""""""""""""""""""""""""""""""""""""""

인자 없이 실행하면 사용 가능한 명령 목록이 출력된다.

.. code-block:: bash

  ./migration.sh

출력:

.. code-block:: text

  Thank you for using CUBRID Migration Toolkit(CMT) Console.

  Available <command> (Default is "start"):
      start [options] [script_file]   Start a migration task.
      script [options] [output_dir]   Build a migration script.
      log [options] [mh_file]         Review a migration work's log.
      report [options] [mh_file]      Review a migration work's result.

  For more information on a command, run:
    migration.sh <command> --help (Linux)
    migration.bat <command> --help (Windows)

start — 마이그레이션 실행
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``start`` 명령은 XML 마이그레이션 스크립트를 읽어 실제 마이그레이션을 수행한다. 첫 번째 인자가 네 가지 하위 명령 이름이 아니면 자동으로 ``start`` 명령으로 처리되므로, 다음 두 표현은 동등하다.

.. code-block:: bash

  ./migration.sh start migration.xml
  ./migration.sh migration.xml

옵션
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 10 22 18 50

    * - 옵션
      - 인자
      - 기본값
      - 설명
    * - ``-s``
      - 설정 이름
      - 스크립트 값
      - ``db.conf``\의 원본 데이터베이스 설정 이름. 스크립트의 원본 연결 정보를 대체한다.
    * - ``-t``
      - 설정 이름
      - 스크립트 값
      - ``db.conf``\의 대상 데이터베이스 설정 이름. 스크립트의 대상 연결 정보를 대체한다.
    * - ``-sd``
      - 파일 경로
      - 스크립트 값
      - 원본 데이터베이스의 JDBC 드라이버 JAR 경로
    * - ``-td``
      - 파일 경로
      - 스크립트 값
      - 대상 데이터베이스의 JDBC 드라이버 JAR 경로
    * - ``-tp``
      - 디렉토리 경로
      - 스크립트 값
      - 파일 기반 대상으로 출력할 때 산출물이 저장될 디렉토리
    * - ``-xml``
      - 파일 경로
      - (없음)
      - 원본이 MySQL XML dump인 경우 dump 파일 경로
    * - ``-rm``
      - ``error`` / ``info`` / ``debug``
      - (없음)
      - 이력 파일(``.mh``)에 기록되는 보고서 로그의 상세 수준 (Report Mode). 지정하지 않으면 스크립트에 설정된 수준을 따른다.
    * - ``-do``
      - ``yes`` / ``no``
      - ``no``
      - ``yes`` 면 스키마 생성을 건너뛰고 데이터만 적재한다. 대상 Table이 이미 존재해야 한다.

JDBC 드라이버 결정 순서
""""""""""""""""""""""""""""""""""""""""""""

원본/대상에 사용할 JDBC 드라이버는 다음 우선순위로 결정된다.

1. ``-sd`` / ``-td`` 옵션으로 지정한 경로
2. ``-s`` / ``-t``\를 사용한 경우 ``db.conf``\의 ``{이름}.driver`` 값
3. 마이그레이션 스크립트 XML에 저장된 드라이버 경로

결정된 경로의 드라이버를 인식하지 못하면 ``Invalid driver : <경로>`` 메시지와 함께 중단된다. 이 경우 ``-sd`` / ``-td``\로 올바른 JAR 경로를 지정한다.

예제
""""""""""""""""""""""""""""""""""""""""""""

**예제 1 — 기본 실행 (스크립트의 연결 정보 그대로 사용)**

.. code-block:: bash

  ./migration.sh start migration.xml

**예제 2 — db.conf의 설정으로 연결 정보 대체**

.. code-block:: bash

  ./migration.sh start -s oracle_prod -t cubrid_prod migration.xml

원본은 ``oracle_prod.*`` 프로퍼티, 대상은 ``cubrid_prod.*`` 프로퍼티를 사용한다.

**예제 3 — 파일 출력 대상으로 보내기**

.. code-block:: bash

  ./migration.sh start -s oracle_prod -t cubrid_dump \
                       -tp /data/exports/oracle_2025 migration.xml

스크립트에 지정된 출력 경로 대신 ``-tp`` 디렉토리에 산출물을 저장한다.

**예제 4 — 데이터 전용 마이그레이션 (스키마 생성 생략)**

.. code-block:: bash

  ./migration.sh start -s oracle_prod -t cubrid_prod -do yes migration.xml

대상에 이미 존재하는 Table에 데이터만 추가로 적재한다. 대상 스키마가 없거나 호환되지 않으면 실패한다.

**예제 5 — 보고서 로그 디버그 기록 + 사용자 드라이버**

.. code-block:: bash

  ./migration.sh start -sd <Oracle JDBC 드라이버 jar 경로> \
                       -td <CUBRID JDBC 드라이버 jar 경로> \
                       -rm debug migration.xml

번들 드라이버 대신 별도 경로의 JDBC 드라이버를 사용하고, 이력에 기록되는 보고서 로그를 디버그 수준(오류 스택트레이스 포함)으로 남긴다.

script — XML 스크립트 생성
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``script`` 명령은 ``db.conf``\의 원본 / 대상 설정을 읽어 마이그레이션 스크립트 XML 파일을 생성한다. 생성된 파일은 그대로 ``start`` 명령에 입력할 수 있다.

옵션
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 12 22 16 50

    * - 옵션
      - 인자
      - 기본값
      - 설명
    * - ``-s``
      - 설정 이름
      - (필수)
      - ``db.conf``\의 원본 데이터베이스 설정 이름
    * - ``-t``
      - 설정 이름
      - (필수)
      - ``db.conf``\의 대상 데이터베이스 설정 이름
    * - ``-o``
      - 디렉토리 경로
      - (필수)
      - 생성된 XML 파일이 저장될 디렉토리 경로

예제
""""""""""""""""""""""""""""""""""""""""""""

**예제 1 — Oracle → CUBRID 스크립트 생성**

.. code-block:: bash

  ./migration.sh script -s oracle_prod -t cubrid_prod -o /home/user/scripts

``/home/user/scripts/ORACLE_<dbname>_<timestamp>.xml`` 파일이 생성된다.

**예제 2 — 현재 디렉토리에 생성**

.. code-block:: bash

  ./migration.sh script -s oracle_prod -t cubrid_prod -o .

report — 마이그레이션 결과 보고서
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``report`` 명령은 완료된 마이그레이션의 결과 보고서를 출력한다. 보고서는 ``start`` 명령이 자동으로 저장하는 ``.mh`` (migration history) 파일에 들어 있다. ``.mh`` 파일은 ``<밀리초epoch>.mh`` 형태로 이름이 지어지며(예: ``1716166534123.mh``), 마이그레이션 시작 시각의 밀리초 단위 epoch 값을 그대로 사용한다.

옵션
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 12 25 63

    * - 옵션
      - 인자
      - 설명
    * - ``-l``
      - 없음
      - 보고서 디렉토리에서 가장 최근에 생성된 ``.mh`` 파일을 자동으로 선택
    * - ``-ao``
      - 없음
      - 페이지 단위로 끊지 않고 전체 보고서를 한 번에 출력

위치 인자로 ``.mh`` 파일 경로를 직접 지정할 수도 있다. ``-l``\을 쓰는 경우 위치 인자는 생략한다.

출력 섹션
""""""""""""""""""""""""""""""""""""""""""""

보고서는 세 섹션으로 구성된다.

- ``[Overview]`` — 객체 타입(Table, View, Procedure 등)별 총계, Exported / Imported 카운트
- ``[Schema migration]`` — 각 객체별 DDL 실행 결과 (successfully / failed). 각 객체의 DDL 본문은 항상 출력되며, 실패한 경우 오류 메시지가 추가로 출력된다.
- ``[Data migration]`` — 원본 → 대상 Table 쌍별 Total / Exported / Imported 레코드 수

페이지 진행
""""""""""""""""""""""""""""""""""""""""""""

기본적으로 한 페이지(10개 항목)를 출력한 뒤 일시 정지한다.

.. code-block:: text

  <Press [enter] to continue...>

ENTER 키로 다음 페이지를 본다. ``q`` / ``exit`` / ``quit``\을 입력하면 중단한다. ``-ao`` 옵션을 주면 일시 정지 없이 끝까지 출력한다.

예제
""""""""""""""""""""""""""""""""""""""""""""

**예제 1 — 가장 최근 보고서 조회**

.. code-block:: bash

  ./migration.sh report -l

**예제 2 — 특정 이력 파일 조회**

.. code-block:: bash

  ./migration.sh report 1716166534123.mh

이력 파일 이름은 마이그레이션 시작 시각의 밀리초 epoch 값 뒤에 ``.mh`` 확장자가 붙은 형태이다. 사용자는 자신의 이력 디렉토리에 실제로 존재하는 파일 이름으로 대체해 입력한다.

.. code-block:: bash

  ./migration.sh report <마이그레이션이력파일.mh>

**예제 3 — 보고서를 파일로 캡처**

.. code-block:: bash

  ./migration.sh report -l -ao > migration_report.txt

페이지 분할 없이 전체 보고서를 파일로 리다이렉트한다.

log — 마이그레이션 실행 로그
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``log`` 명령은 마이그레이션 실행 중 기록된 로그를 출력한다. 로그도 ``.mh`` 이력 파일에 들어 있다.

옵션
""""""""""""""""""""""""""""""""""""""""""""

.. list-table::
    :header-rows: 1
    :widths: 12 20 18 50

    * - 옵션
      - 인자
      - 기본값
      - 설명
    * - ``-l``
      - 없음
      - N/A
      - 보고서 디렉토리에서 가장 최근 ``.mh`` 파일을 자동 선택
    * - ``-ps``
      - 정수
      - ``50``
      - 한 페이지에 출력할 줄 수. 유효한 정수가 아니면 기본값으로 폴백.

페이지 단위 보기
""""""""""""""""""""""""""""""""""""""""""""

지정한 줄 수만큼 출력한 뒤 ``<Press [enter] to continue...>`` 프롬프트가 뜬다. ENTER 로 다음 페이지, ``q`` / ``exit`` / ``quit``\로 종료한다.

예제
""""""""""""""""""""""""""""""""""""""""""""

**예제 1 — 가장 최근 로그 조회 (기본 50줄/페이지)**

.. code-block:: bash

  ./migration.sh log -l

**예제 2 — 페이지 크기 100줄로 조회**

.. code-block:: bash

  ./migration.sh log -l -ps 100

**예제 3 — 특정 이력 파일의 로그 조회**

.. code-block:: bash

  ./migration.sh log 1716166534123.mh -ps 25

``1716166534123.mh`` 자리에는 실제 이력 디렉토리에 존재하는 파일 이름을 입력한다(파일명은 ``<밀리초epoch>.mh`` 형식).

.. _db-conf:

db.conf — 콘솔 환경 설정 파일
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``db.conf``\는 콘솔 모드에서 원본 / 대상 데이터베이스 연결 정보를 저장하는 Java 프로퍼티 파일이다. ``-s`` / ``-t`` 옵션이 이 파일에서 설정 이름을 찾아 연결 정보를 채워 넣는다.

위치 및 형식
""""""""""""""""""""""""""""""""""""""""""""

- **위치**: CMT 설치 디렉토리 루트 (``migration.sh`` / ``migration.bat``\와 같은 디렉토리)
- **형식**: ``{설정이름}.{속성}=값`` 형태의 키-값 프로퍼티. 한 파일에 여러 설정을 등록할 수 있다.
- ``{설정이름}``\은 미리 정해진 값이 아니라 **사용자가 자유롭게 정하는 식별자**\이다. 여기서 정한 이름을 ``script`` / ``start`` 명령의 ``-s`` / ``-t`` 옵션 값으로 그대로 지정한다. 예를 들어 ``oracle_prod.host=...``\로 등록했다면 ``-s oracle_prod``\로 사용한다.
- ``#``\으로 시작하는 줄은 주석이다.

속성 표
""""""""""""""""""""""""""""""""""""""""""""

아래 표의 ``{이름}`` 자리에는 사용자가 정한 설정 이름이 들어간다.

**연결 정보 (Online DB 공통)**

.. list-table::
    :header-rows: 1
    :widths: 25 25 50

    * - 속성
      - 예
      - 설명
    * - ``{이름}.host``
      - ``db.example.com``
      - 데이터베이스 호스트명 또는 IP
    * - ``{이름}.port``
      - ``3306``
      - 포트 번호
    * - ``{이름}.dbname``
      - ``myapp_production``
      - 데이터베이스 이름
    * - ``{이름}.type``
      - ``mysql``
      - 데이터베이스 종류 (``cubrid``, ``oracle``, ``mysql``, ``mariadb``, ``mssql``, ``informix``, ``tibero``)
    * - ``{이름}.user``
      - ``migration_user``
      - 접속 계정
    * - ``{이름}.password``
      - ``SecurePassword``
      - 접속 비밀번호
    * - ``{이름}.charset``
      - ``utf8``
      - 문자셋 (``utf8``, ``utf8mb4``, ``euc_kr`` 등)
    * - ``{이름}.driver``
      - ``/opt/drivers/mysql.jar``
      - JDBC 드라이버 JAR 경로

**파일 기반 대상 속성**

.. list-table::
    :header-rows: 1
    :widths: 30 25 45

    * - 속성
      - 예
      - 설명
    * - ``{이름}.type``
      - ``unload``
      - 파일 대상 종류. ``unload`` (CUBRID dump), ``sql``, ``csv``, ``xls`` 중 하나. 온라인 CUBRID 대상은 연결 정보의 ``type=cubrid``\를 사용한다. 누락(공란)되면 콘솔 실행이 중단된다.
    * - ``{이름}.output``
      - ``/var/exports/mydb``
      - 산출물 디렉토리
    * - ``{이름}.file_prefix``
      - ``export``
      - 산출 파일 접두사
    * - ``{이름}.charset``
      - ``UTF-8``
      - 파일 인코딩
    * - ``{이름}.split_schema``
      - ``yes`` / ``no``
      - 스키마 DDL을 객체 종류별 파일로 분리할지 여부. ``yes`` 면 ``class``, ``pk``, ``fk``, ``indexes`` 등으로 나뉘고, ``no`` 면 통합 스키마 파일 위주로 생성된다.
    * - ``{이름}.add_schema``
      - ``yes`` / ``no``
      - DDL 객체 이름에 사용자 스키마 prefix(``[owner].``) 포함 여부. ``yes`` 면 모든 DDL의 객체 이름이 스키마 prefix와 함께 출력된다. 기본값 ``yes`` (값이 비어 있거나 ``no``\가 아니면 모두 ``yes``\로 간주).
    * - ``{이름}.one_table_one_file``
      - ``yes`` / ``no``
      - CUBRID dump / SQL 대상에서 데이터 파일을 Table당 한 파일로 분리할지 여부. CSV / XLS 대상은 이 값과 무관하게 출력 동작상 항상 Table별 파일을 사용한다.

예시 db.conf
""""""""""""""""""""""""""""""""""""""""""""

.. code-block:: properties

  # Oracle 원본
  oracle_prod.host=oracle.internal
  oracle_prod.port=1521
  oracle_prod.dbname=ORCL
  oracle_prod.type=oracle
  oracle_prod.user=migration
  oracle_prod.password=OraclePassword
  oracle_prod.charset=UTF-8
  oracle_prod.driver=<Oracle JDBC 드라이버 jar 경로>

  # CUBRID 대상
  cubrid_prod.host=cubrid.internal
  cubrid_prod.port=33000
  cubrid_prod.dbname=myapp
  cubrid_prod.type=cubrid
  cubrid_prod.user=dba
  cubrid_prod.password=CubridPassword
  cubrid_prod.charset=utf8
  cubrid_prod.driver=<설치 경로>/jdbc/JDBC-11.3.2.0053-cubrid.jar

  # 파일 출력 대상 (unload)
  file_export.type=unload
  file_export.output=/var/exports/mydb
  file_export.charset=UTF-8
  file_export.one_table_one_file=yes

.. note::
  ``db.conf``\가 없으면 메시지 없이 건너뛰고, 파일이 있는데 읽지 못하면 ``Load db.conf error.`` 메시지가 출력된다. 어느 경우든 명령 자체는 중단되지 않는다. ``-s`` / ``-t``\를 쓰지 않는 호출(예: 스크립트 그대로 실행)은 ``db.conf`` 없이도 동작한다.

콘솔 진행률 / 로그 출력 포맷
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``start`` 명령은 마이그레이션 진행 중 콘솔에 전체 진행률과 현재 처리 중인 Table별 진행률을 출력한다.

.. code-block:: text

  Record Migration Progress: 25% [1000000 / 4000000 records]
  owner.table1(1/50) | 50000 / 100000 50%
  owner.table2(2/50) | 25000 / 200000 12%

표시 항목:

- **첫 줄**: 전체 진행률 — 완료 레코드 수 / 총 레코드 수와 백분율
- **Table 줄**: 현재 처리 중인 각 Table의 ``소유자.테이블명(순번/전체) | 적재 레코드 / 전체 레코드 백분율``

화면은 ANSI 이스케이프 코드로 갱신되어 같은 위치에 덮어쓴다.

최종 결과 배너
""""""""""""""""""""""""""""""""""""""""""""

마이그레이션이 끝나면 요약 정보와 결과 배너가 출력된다.

.. code-block:: text

  -------------------------------------------------------------
  Migration Report summary:
      Time used: 00 00:01:23.456
      schema: Exported[1]; Imported[1]
      table: Exported[120]; Imported[120]
      view: Exported[5]; Imported[5]
      primary key: Exported[120]; Imported[120]
      foreign key: Exported[45]; Imported[45]
      index: Exported[80]; Imported[80]
      sequence: Exported[3]; Imported[3]
      synonym: Exported[0]; Imported[0]
      trigger: Exported[0]; Imported[0]
      plcsql_function: Exported[0]; Imported[0]
      plcsql_procedure: Exported[0]; Imported[0]
      grant: Exported[0]; Imported[0]
      record: Exported[4000000]; Imported[4000000]
  -------------------------------------------------------------

  =============================================================
  MIGRATION RESULT: SUCCESS
  =============================================================

요약 라인은 고정된 ``Objects`` / ``Records`` 라벨이 아니라, **객체 타입별로 한 줄씩 출력**\된다. 객체 타입 라인은 고정된 순서로 항상 모두 출력되며, 마이그레이션 대상이 아닌 타입은 ``Exported[0]; Imported[0]``\으로 표시된다. 형식은 모두 ``<객체 타입>: Exported[N]; Imported[M]``\이다.

SQL 파일을 임포트하는 시나리오에서는 객체 타입 대신 SQL 파일명별로 ``<파일명>: Exported[N]; Imported[M]`` 라인이 출력된다.

첫 줄의 ``Time used``\는 총 경과 시간이며, 형식은 ``dd HH:mm:ss.SSS`` (일 시:분:초.밀리초)이다.

오류가 한 건이라도 있으면 배너는 ``MIGRATION RESULT: FAILED``\로 표기된다.

로그 파일
""""""""""""""""""""""""""""""""""""""""""""

콘솔 출력과는 별개로, 실행 로그는 항상 CMT 로그 디렉토리에 기록된다.

- **경로**: ``<설치 경로>/workspace/cmt/log/cubrid-migration.log``
- **롤링**: 100MB 또는 하루를 넘기면 ``cubrid-migration.yyyy-MM-dd.N.log.gz`` 형태로 압축 롤링된다.
- 로그 파일은 ``logback.xml`` 설정에 따라 기본 INFO 이상 레벨로 기록된다.

이력 파일(``.mh``)은 ``report`` / ``log`` 명령으로 다시 조회할 수 있도록 별도로 보관된다.

결과 보고서 화면은 :doc:`10_report`\을, 성능 / 동시성 / 메모리 관련 설정은 :doc:`11_config`\와 :doc:`12_advanced`\을 참고한다.
