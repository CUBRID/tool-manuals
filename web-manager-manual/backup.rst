*******************************
백업 / 복원 / 언로드 / 로드
*******************************

즉시 백업 실행
==============

.. image:: /images/backup-database.png

Manage Database → **데이터베이스 백업(Backup Database)** 를 선택한다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 백업 레벨(Backup Level)
      - 0(전체) / 1(증분 1) / 2(증분 2) 중 선택
      - 0(전체)
    * - 백업 디렉터리(Backup Directory) \*
      - 백업 볼륨이 저장될 디렉터리 경로. 지정하지 않으면 로그 디렉터리에 저장된다
      - —
    * - 병렬 스레드 수(Parallel threads)
      - 백업을 수행하는 스레드 개수
      - 자동
    * - 데이터베이스 정합성 확인(Check database consistency)
      - 끄면 정합성 확인을 건너뛴다
      - 켜짐
    * - 불필요한 로그 파일 삭제(Delete unnecessary archived logs)
      - 켜면 더 이상 필요 없는 로그 파일을 지운다 (CUBRID 공식 설명에 "유의해서 사용해야 합니다"라는 경고 포함)
      - 꺼짐
    * - 백업 볼륨 압축(Compress backup volume)
      - 켜면 백업 볼륨을 압축한다
      - 켜짐

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Backup Directory를 비운 채 실행하면 "백업 디렉터리는 필수 입력
    항목입니다." 오류가 표시된다.

.. note::

    이전 버전에 있던 "Volume Name" 입력란은 제거되었다. Backup Directory 하나만 입력하면 된다.

백업 볼륨 이름은 백업 레벨과 무관하게 항상 ``데이터베이스이름_backup`` 으로 고정해서 저장되는데, 이는 볼륨
이름이 비어 있으면 경로에 문자 그대로 ``"(null)"`` 이 들어가는 일부 버전의 CMS 버그(CBRD-27065)를 피하기 위한
NCA 쪽 우회 처리이다 (CMS 11.5 이상에서는 해당 버그 자체가 수정되어 있다).

백업 계획 (예약 백업)
=====================

.. image:: /images/backup-plan.png

데이터베이스 → Job automation → **백업 자동화 계획(Backup Plan)** 폴더 우클릭 → **백업 자동화 계획 추가(Create Backup Plan)** 을 선택한다.

Backup Plan은 즉시 백업과 달리 CMS의 예약 실행 기능이다. Plan ID/스케줄 관련 필드는 CMS/webmanager 자체의
개념이며 CUBRID 유틸리티 옵션과는 대응하지 않는다. 반면 백업 자체(Backup Level/Path/Delete archive
logs/Check consistency/Compress/Threads/Online·Offline)는 예약된 시각에 CMS가 실제로 ``backupdb`` 를
실행할 때 즉시 백업과 동일한 옵션으로 전달된다(위 "즉시 백업 실행" 절 참고).

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 계획 ID(Plan ID) / 경로(Path) / 반복 주기·시각
      - CMS/webmanager 고유의 예약 스케줄 정보(반복 주기는 월간/주간/일간/특정 요일 중 선택)
      - —
    * - 온라인 모드 / 오프라인 모드(Online mode / Offline mode)
      - 백업 시점에 데이터베이스를 어떤 모드로 볼지 선택한다. 즉시 백업(Backup Database)은 CMS가 현재 상태를
        자동으로 감지하지만, Backup Plan은 사용자가 직접 지정한다
      - —
    * - 통계 정보 갱신(Update statistics)
      - 켜져 있고 **오프라인 모드(Offline mode)**\ 로 설정된 계획이면, 백업이 끝난 뒤 전체 클래스 대상 통계
        정보를 갱신한다 (Online mode 계획에서는 켜져 있어도 실행되지 않는다)
      - 꺼짐
    * - 보관할 백업 세트 수(retention)
      - 화면에는 있지만, 이 값을 근거로 오래된 백업을 자동 삭제하는 동작은 확인되지 않는다 — 오래된 백업
        삭제는 직접 관리해야 한다
      - —

.. warning::

    Plan ID(계획 ID)와 Path(경로) 필드는 값을 반드시 입력하도록 강제하는 검증이 화면에 없다 — 기본값이 자동으로 채워지지만, 이를
    지우고 빈 값으로 실행해도 오류 없이 그대로 저장된다. 두 값 모두 실제로 의미 있는 값을 직접 확인하고 입력하는
    것을 권장한다 (:doc:`known_issues` 참고).

.. warning::

    CMS 호스트의 OS 사용자가 기본 백업 디렉터리에 쓰기 권한이 없으면 "Permission denied" 오류가 발생할 수 있다.
    이는 환경 설정 문제이며 앱의 오류가 아니다. 그 외의 오류 메시지가 표시되면 실제 문제일 가능성이 높다.

백업 자동화 계획 수행 로그 (Auto Backup Log)
==============================================

.. image:: /images/backup-auto-log.png

데이터베이스 → Job automation → **백업 자동화 계획(Backup Plan)** 폴더 우클릭 → **백업 자동화 계획 수행로그(Auto Backup Log)** 를 선택하면 열린다. 예약된
Backup Plan이 실제로 실행된 이력을 보여주는 읽기 전용 로그 화면이다.

* 컬럼: **백업 ID(Backup ID)**, **로그 시간(Log Time)**, **설명(Description)** — Description 칸은 텍스트에 "success"가 포함되면 초록색
  체크 아이콘, "auto job start"가 포함되면 파란색 재생 아이콘, 그 외에는 빨간색 오류 아이콘과 함께 표시된다.
* ID/설명으로 필터링, 15건 단위 페이지네이션 또는 전체 보기 전환이 가능하다.
* 현재 선택된 데이터베이스로 목록이 좁혀지며, 선택된 데이터베이스가 없으면 호스트 전체 이력("Global Backup
  History")을 보여준다.
* **새로 고침(Refresh)** 버튼으로 다시 불러온다.

복원
====

.. image:: /images/database-restore.png

Manage Database → **데이터베이스 복구(Restore Database)** (데이터베이스가 중지 상태여야 한다). 복원 시점 선택 또는 백업 레벨별 파일을 직접 지정할 수 있다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 복구 시점 지정(Specify restore date)
      - 백업 시점 또는 ``dd-mm-yyyy:hh:mm:ss`` 형식의 특정 시각으로 데이터베이스 상태를 복구한다
      - —
    * - 백업 레벨 선택(Select backup information)
      - 복구에 사용할 백업 레벨과 백업 볼륨이 있는 디렉터리 경로
      - 레벨 0(전체)
    * - 부분 복구 수행(Perform partial recovery)
      - 아카이브 로그가 없을 경우 강제로 부분 복구를 수행한다
      - 꺼짐
    * - 복원 경로 변경(Change restore path)
      - 데이터베이스 위치 파일을 새 경로로 다시 쓴 뒤, 그 경로를 기준으로 복구하도록 지시한다
      - 꺼짐

.. note::

    체크박스로 켜는 옵션(특정 시점 지정, 백업 파일 직접 지정, 복원 경로 변경 등)은 켜는 순간 관련 입력란이 필수로
    바뀐다. 예를 들어 "Specify restore date"를 켜면 Date/Time을 비워둘 수 없고, "Select backup information"을
    켜면 해당 레벨의 백업 파일 경로를 비워둘 수 없다 — 값이 없으면 **복구 실행(Execute Restore)** 버튼이 비활성화된다.

.. warning::

    HA 복제에 포함된 데이터베이스는 이 화면으로 복원할 수 없다 — 시도하면 오류가 표시된다. 이 화면이 쓰는 일반
    ``restoredb`` 는 HA 복제 재개 위치를 기록하는 ``ha_apply_info`` 카탈로그를 갱신하지 않기 때문이다. CUBRID는
    HA용으로 별도의 ``restoreslave`` 유틸리티를 제공하지만, NCA는 이를 호출하지 않는다 — HA 데이터베이스를
    복원해야 하면 호스트에 직접 접속해 CLI로 처리해야 한다.

언로드
======

.. image:: /images/database-unload.png

Manage Database → **데이터베이스 언로드(Unload Database...)** 를 선택한다. 대상 디렉터리, 스키마/데이터 포함 범위, 테이블 선택 등을
설정한다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 대상 디렉터리(Target Directory) \*
      - 출력 디렉터리 경로
      - —
    * - Schema 포함 / Data 포함
      - 스키마만 / 오브젝트만 처리할지 선택한다. 둘 다 켜면 스키마와 데이터 둘 다 처리된다
      - 둘 다 켜짐
    * - 선택한 테이블만(테이블 목록)
      - 지정한 테이블 이름 목록만 처리한다
      - 전체 클래스
    * - 참조 테이블 포함(Include referenced tables)
      - "선택한 테이블만"이 함께 지정되어야 의미가 있다
      - 꺼짐
    * - 구분 식별자 사용(Use delimited identifier)
      - 식별자 처음과 끝에 큰따옴표를 사용한다
      - 꺼짐
    * - 출력 파일 접두어(Prefix output files)
      - 지정하지 않으면 데이터베이스 이름이 접두어로 사용된다
      - 데이터베이스 이름
    * - 해시 파일(File for hash)
      - 해시 파일 경로
      - —
    * - 캐시 페이지 수(Number of cached pages)
      - —
      - 계산됨(자동)
    * - 예상 인스턴스 수(Estimated instances)
      - —
      - 계산됨(자동)

.. warning::

    "LO file count per directory" 필드는 ``unloaddb`` 의 ``--lo-count`` 옵션에 대응하는데, 이 옵션은 CUBRID
    엔진 소스(``utility.h``)에 **"deprecated option that has been removed"** (지원 종료되어 제거된 옵션)라고
    명시되어 있다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Target Directory(대상 디렉터리) \* 는 필수이며, 비워두면 실행 버튼이
    비활성화된다. Schema/Data 포함 범위는 최소 하나 이상 "포함"으로 선택해야 하고, "선택한 테이블만" 옵션을 쓸
    경우 테이블을 최소 1개 이상 선택해야 한다.

로드
====

.. image:: /images/database-load.png

Manage Database → **데이터베이스 로드(Load Database...)** 를 선택한다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 사용자 이름 / 비밀번호(User Name / Password)
      - 적재를 수행할 DB 계정 정보
      - —
    * - 신택스 검사 후 적재(Check syntax and load database)
      - 기본적으로 꺼져 있으며, **꺼진 상태에서는 신택스 검사 없이 데이터만 적재한다.**
      - 꺼짐
    * - 로그 기록 안 함(No log)
      - 트랜잭션 로그를 기록하지 않고 적재한다
      - 꺼짐
    * - 예상 인스턴스 수(Estimated instances)
      - 적재할 데이터 양을 미리 추정한 값
      - 5000
    * - 주기적 커밋 카운트(Periodic commit)
      - 지정한 레코드 수마다 커밋한다
      - 10240
    * - Don't use OID(OID 사용 안 함)
      - 객체 ID(OID)를 사용하지 않고 적재한다
      - 꺼짐
    * - Don't update statistics(통계 정보 갱신 안 함)
      - 적재 후 통계 정보를 갱신하지 않는다
      - 꺼짐
    * - 에러 제어 파일(Error control file)
      - 적재 중 발생하는 에러 처리 방식을 지정한 파일
      - —
    * - 제외 테이블 파일(Ignored table file)
      - 적재에서 제외할 테이블 이름 목록 파일
      - —
    * - Schema / Object(Data) / Index 파일 경로
      - 각각 스키마 / 데이터 / 인덱스 파일 경로
      - —
    * - Trigger 파일 경로
      - 화면에는 있지만 실제로 동작하지 않는다. :doc:`known_issues` 참고.
      - —

.. warning::

    Load의 기본 대상은 기존 데이터베이스이므로, 잘못 실행하면 실제 데이터를 덮어쓸 수 있다. 실행 전 대상 데이터베이스명을 반드시 확인한다.
