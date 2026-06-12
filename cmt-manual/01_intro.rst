소개
----

본 챕터는 CUBRID Migration Toolkit이 어떤 도구이고 어떤 기능을 제공하는지 소개하고, 본 매뉴얼에서 사용하는 표기 규약을 설명한다.

본 매뉴얼은 CMT를 처음 사용하는 데이터베이스 관리자와 개발자를 대상으로 한다. 마이그레이션을 준비하고, GUI 또는 콘솔로 실행하고, 결과를 검증하는 전체 흐름을 다룬다.

CMT란
^^^^^^^^

**CUBRID Migration Toolkit(이하 CMT)**\은 Oracle, MySQL, MariaDB, MSSQL, Informix, Tibero, CUBRID 데이터베이스의 스키마와 데이터를 CUBRID 데이터베이스로 마이그레이션하기 위한 도구이다.

CMT는 원본 데이터베이스의 객체(Table, View, Index, Serial(Sequence), Synonym, Grant, Procedure(PL/CSQL), Function(PL/CSQL) 등)와 데이터를 자동으로 추출하여 CUBRID 호환 형식으로 변환한다. 변환 과정에서 데이터 타입 매핑, 컬럼 속성, 객체 이름 등을 사용자가 직접 조정할 수 있다.

CMT는 다음 두 가지 모드로 실행할 수 있다.

- **GUI 모드(Desktop)**: 그래픽 인터페이스를 제공하며, 마법사 화면을 통해 마이그레이션 설정과 모니터링을 수행한다.
- **콘솔 모드(Console)**: 명령줄 기반 실행 모드로, 사전에 작성된 스크립트로 마이그레이션을 수행한다.

주요 기능
^^^^^^^^^^^^

- **스키마 마이그레이션**: Table, Column, Primary Key, Foreign Key, Index, View, Serial(Sequence), Synonym, Grant, Procedure(PL/CSQL), Function(PL/CSQL) 변환
- **데이터 마이그레이션**: 원본 데이터를 CUBRID 호환 형식으로 변환하여 적재
- **유연한 출력 형식**: 운영 중인 CUBRID에 직접 적재(온라인) 또는 dump/SQL/CSV/XLS 파일로 출력(오프라인)
- **데이터 타입 매핑 사용자 정의**: 기본 매핑을 사용자가 직접 수정 가능
- **객체별 마이그레이션 선택**: 원하는 객체만 선택하여 마이그레이션
- **마이그레이션 예약**: 1회 실행, 매일 반복 실행, 고급(Unix Cron 구문) 모드 지원
- **마이그레이션 보고서**: 객체별·레코드별로 실행 결과 확인

CMT는 한 번의 작업에서 하나의 원본 데이터베이스를 하나의 대상에 매핑한다. 마이그레이션 정의를 스크립트로 저장해 두면 GUI에서 재실행하거나 콘솔에서 자동화할 수 있어 반복 작업에 그대로 활용할 수 있다.

지원 원본 데이터베이스
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 25 20

    * - 데이터베이스
      - 기본 포트
    * - CUBRID
      - 33000
    * - Oracle
      - 1521
    * - MySQL
      - 3306
    * - MariaDB
      - 3306
    * - MSSQL
      - 1433
    * - Informix
      - 9088
    * - Tibero
      - 8629

지원 대상 출력 형식
^^^^^^^^^^^^^^^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 형식
      - 설명
    * - 온라인 CUBRID
      - 운영 중인 CUBRID 데이터베이스에 JDBC로 직접 연결하여 마이그레이션
    * - CUBRID dump
      - ``loaddb`` 유틸리티로 적재 가능한 CUBRID 덤프 형식 파일
    * - SQL
      - DDL과 데이터를 SQL 문(.sql) 파일로 출력
    * - CSV
      - 데이터를 Table별 CSV 파일로 출력하고, 스키마 DDL은 별도 SQL 파일로 생성
    * - XLS
      - 데이터를 Table별 Excel 파일로 출력하고, 스키마 DDL은 별도 SQL 파일로 생성

매뉴얼 표기 규약
^^^^^^^^^^^^^^^^^^^^

본 매뉴얼에서는 다음 표기 규약을 사용한다.

- ``코드체``: 명령, 옵션, 파일 경로, 환경 변수, XML 태그, SQL 키워드
- **굵은 글씨**: 화면의 버튼, 메뉴, 입력 항목 라벨 (예: **새 마이그레이션**, **테스트**)
- 원본 / 대상: 마이그레이션의 source / target
- 객체 타입은 영문 표기를 우선 사용한다 (Synonym, Grant, Index 등).

.. note::
  화면 캡처는 Windows 환경의 한국어 로케일을 기준으로 한다.
