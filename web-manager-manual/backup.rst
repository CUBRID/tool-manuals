*******************************
백업 / 복원 / 언로드 / 로드
*******************************

즉시 백업 실행
==============

.. image:: /images/backup-database.png

Manage Database → **Backup Database** 를 선택한다. 아래 필드는 실제로는 CMS를 거쳐 CUBRID의 ``backupdb``
유틸리티를 실행시키며, 각 설명은 CUBRID 엔진의 공식 ``--help`` 텍스트(``msg/ko_KR.utf8/utils.msg``)를 그대로
옮긴 것이다.

* **Backup Level** — ``backupdb -l``. 0(전체), 1(증분 1), 2(증분 2) 중 선택.
* **Backup Directory(백업 디렉터리)** \* — ``backupdb -D``. 백업 볼륨이 저장될 디렉터리 경로. 지정하지 않으면
  로그 디렉터리에 저장된다.
* **Parallel threads(병렬 스레드 수)** — ``backupdb -t``. 백업을 수행하는 스레드 개수. 기본값은 자동.
* **Check database consistency(데이터베이스 정합성 확인)**, 기본 켜짐 — 체크를 켜면 아무 옵션도 추가되지 않는다
  (정합성 확인이 기본 동작). **체크를 끄면** ``--no-check`` 가 추가되어 정합성 확인을 건너뛴다.
* **Delete unnecessary archived logs(불필요한 로그 파일 삭제)** — ``backupdb -r``. 켜면 더 이상 필요 없는 로그
  파일을 지운다. CUBRID 공식 설명에 "유의해서 사용해야 합니다"라는 경고가 포함되어 있다.
* **Compress backup volume(백업 볼륨 압축)**, 기본 켜짐 — 켜면 ``--compress`` 가 추가된다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Backup Directory를 비운 채 실행하면 "백업 디렉터리는 필수 입력
    항목입니다." 오류가 표시된다.

.. note::

    이전 버전에 있던 "Volume Name" 입력란은 제거되었다. Backup Directory 하나만 입력하면 된다.

백업 계획 (예약 백업)
=====================

.. image:: /images/backup-plan.png

데이터베이스 → Job automation → **Backup Plan** 폴더 우클릭 → **Create Backup Plan** 을 선택한다.

Backup Plan은 즉시 백업과 달리 CMS의 예약 실행 기능이다. Plan ID/스케줄 관련 필드는 CMS/webmanager 자체의
개념이며 CUBRID 유틸리티 옵션과는 대응하지 않는다. 반면 백업 자체(Backup Level/Path/Delete archive
logs/Check consistency/Compress/Threads/Online·Offline)는 예약된 시각에 CMS가 실제로 ``backupdb`` 를
실행할 때 즉시 백업과 동일한 옵션으로 전달된다(위 "즉시 백업 실행" 절 참고).

* **Plan ID(계획 ID)**, **Path(경로)**, 반복 주기(월간/주간/일간/특정 요일)와 시각 — CMS/webmanager 고유의 스케줄
  개념으로, CUBRID 유틸리티에는 대응하는 옵션이 없다.
* **Online mode / Offline mode** — 백업 시점에 데이터베이스를 CS 모드(``-C, --CS-mode``)로 볼지 SA 모드
  (``-S, --SA-mode``)로 볼지 선택한다. 즉시 백업(Backup Database)에서는 이 선택지가 없고 CMS가 현재 상태를
  자동으로 감지하지만, Backup Plan에서는 사용자가 직접 지정한다.
* **Update statistics(통계 정보 갱신)** — 켜져 있고 **Offline mode**\ 로 설정된 계획인 경우, 백업이 끝난 뒤 CMS가
  별도로 ``cubrid optimizedb`` 를 (클래스 지정 없이, 즉 전체 클래스 대상으로) 실행한다. Online mode 계획에서는
  이 옵션이 켜져 있어도 실행되지 않는다.
* **보관할 백업 세트 수(retention)** — 화면에는 존재하지만, 실제로 CMS가 이 값을 근거로 오래된 백업을 자동
  삭제하는 동작은 코드상 확인되지 않는다. 값을 설정해도 자동 정리가 보장되지 않으므로, 오래된 백업 삭제는
  직접 관리해야 한다.

.. warning::

    Plan ID(계획 ID)와 Path(경로) 필드는 화면 자체의 필수 입력 검증이 없다 — 기본값이 자동으로 채워지지만, 이를
    지우고 빈 값으로 실행해도 오류 없이 그대로 저장된다. 두 값 모두 실제로 의미 있는 값을 직접 확인하고 입력하는
    것을 권장한다 (알려진 제약사항, :doc:`known_issues` 참고).

.. warning::

    CMS 호스트의 OS 사용자가 기본 백업 디렉터리에 쓰기 권한이 없으면 "Permission denied" 오류가 발생할 수 있다.
    이는 환경 설정 문제이며 앱의 오류가 아니다. 그 외의 오류 메시지가 표시되면 실제 문제일 가능성이 높다.

복원
====

.. image:: /images/database-restore.png

Manage Database → **Restore Database** (데이터베이스가 중지 상태여야 한다). 복원 시점 선택 또는 백업 레벨별 파일을 직접 지정할 수 있다.
아래 옵션은 실제로 CUBRID의 ``restoredb`` 유틸리티로 전달된다(공식 ``--help`` 텍스트 기준).

* **Specify restore date(복구 시점 지정)** — ``restoredb -d``. 백업 시점(``backuptime``) 또는
  ``dd-mm-yyyy:hh:mm:ss`` 형식의 특정 시각으로 데이터베이스 상태를 복구한다.
* **Select backup information(백업 레벨 선택)** + 레벨별 파일 경로 — ``restoredb -l`` (복구에 사용할 백업 레벨,
  기본값 0/전체) 과 ``restoredb -B`` (백업 볼륨이 있는 디렉터리 경로).
* **Perform partial recovery(부분 복구 수행)** — ``restoredb -p``. 아카이브 로그가 없을 경우 강제로 부분 복구를
  수행한다.
* **Change restore path(복원 경로 변경)** — ``restoredb -u``. 이 옵션은 실제로 값을 커맨드라인 인자로 넘기지
  않는다 — CMS가 먼저 데이터베이스 위치 파일 자체를 새 경로로 다시 쓴 다음, 옵션 없는 ``-u`` 플래그만 붙여서
  "위치 파일에 설정된 경로로 복구하라"고 지시하는 방식으로 동작한다.

.. note::

    체크박스로 켜는 옵션(특정 시점 지정, 백업 파일 직접 지정, 복원 경로 변경 등)은 켜는 순간 관련 입력란이 필수로
    바뀐다. 예를 들어 "Specify restore date"를 켜면 Date/Time을 비워둘 수 없고, "Select backup information"을
    켜면 해당 레벨의 백업 파일 경로를 비워둘 수 없다 — 값이 없으면 **Execute Restore** 버튼이 비활성화된다.

언로드
======

.. image:: /images/database-unload.png

Manage Database → **Unload Database...** 를 선택한다. 대상 디렉터리, 스키마/데이터 포함 범위, 테이블 선택 등을
설정한다. 아래 옵션은 실제로 CUBRID의 ``unloaddb`` 유틸리티로 전달된다(공식 ``--help`` 텍스트 기준).

* **Target Directory(대상 디렉터리)** \* — ``unloaddb -O``. 출력 디렉터리 경로.
* **Schema 포함 / Data 포함** — ``unloaddb -s`` (스키마만) / ``-d`` (오브젝트만). 둘 다 켜면 두 플래그가 모두
  전달되어 스키마와 데이터 둘 다 처리된다(둘 다 처리하는 것이 기본 동작이기도 하다).
* **선택한 테이블만(테이블 목록)** — ``unloaddb -i``. 지정한 테이블 이름 목록만 처리한다(기본값은 전체 클래스).
* **Include referenced tables(참조 테이블 포함)** — ``unloaddb --include-reference``. 공식 설명에 따르면 이
  옵션은 "-i(테이블 지정)가 함께 지정되어야" 의미가 있다.
* **Use delimited identifier(구분 식별자 사용)** — ``unloaddb --use-delimiter``. 식별자 처음과 끝에 큰따옴표를
  사용한다.
* **Prefix output files(출력 파일 접두어)** — ``unloaddb --output-prefix``. 지정하지 않으면 데이터베이스 이름이
  접두어로 사용된다.
* **File for hash(해시 파일)** — ``unloaddb --hash-file``.
* **Number of cached pages(캐시 페이지 수)** — ``unloaddb --cached-pages``. 공식 기본값은 "계산됨"(자동
  계산)이다.
* **Estimated instances(예상 인스턴스 수)** — ``unloaddb --estimated-size``. 공식 기본값도 "계산됨"(자동
  계산)이다.

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

Manage Database → **Load Database...** 를 선택한다. 아래 옵션은 실제로 CUBRID의 ``loaddb`` 유틸리티로
전달된다(공식 ``--help`` 텍스트 기준).

* **User Name / Password** — ``loaddb -u`` / ``-p``.
* **Check syntax and load database(신택스 검사 후 적재)** — 체크를 켜면 아무 옵션도 추가되지 않는다(기본
  동작). **체크를 끄면** ``--load-only`` (``-l``, 신택스 체크 없이 데이터 파일만 적재, SA 모드 전용)가 추가된다.
* **No log(로그 기록 안 함)** — ``loaddb --no-logging``.
* **Estimated instances(예상 인스턴스 수)** — ``loaddb --estimated-size``. 공식 기본값은 5000.
* **Periodic commit(주기적 커밋 카운트)** — ``loaddb -c``. 공식 문서상 기본값은 10240.
* **Don't use OID(OID 사용 안 함)** — ``loaddb --no-oid``.
* **Don't update statistics(통계 정보 갱신 안 함)** — ``loaddb --no-statistics``.
* **Error control file(에러 제어 파일)** — ``loaddb --error-control-file``. 적재 시 발생하는 에러에 대한
  제어 파일.
* **Ignored table file(제외 테이블 파일)** — ``loaddb --ignore-class-file``. 적재하지 않을 클래스 이름이
  있는 파일.
* **Schema / Object(Data) / Index 파일 경로** — 각각 ``loaddb -s`` (스키마 파일), ``-d`` (데이터 파일),
  ``-i`` (인덱스 파일).

.. warning::

    **"Check syntax and load database" 체크박스는 이름과 반대로 동작할 수 있다.** 체크를 켜면(문자 그대로
    "신택스 검사 후 적재") 실제로는 아무 옵션도 추가되지 않아 평소와 동일하게 적재가 진행되고, **체크를 끄면**
    오히려 신택스 검사 없이 데이터만 적재하는 ``--load-only`` 가 켜진다. "신택스만 검사하고 적재하지 않는" 옵션
    (``--data-file-check-only``)은 이 화면에서는 아예 선택할 수 없다.

.. warning::

    **"Trigger" 파일 선택 항목은 실제로 동작하지 않는다.** 화면에서 트리거 파일을 지정해도, CMS 쪽 코드에서
    해당 처리 부분이 비활성화되어 있어(``#if 0``) 어떤 옵션도 ``loaddb`` 에 전달되지 않는다. 트리거는 이 화면으로
    적재할 수 없다.

.. warning::

    Load의 기본 대상은 기존 데이터베이스이므로, 잘못 실행하면 실제 데이터를 덮어쓸 수 있다. 실행 전 대상 데이터베이스명을 반드시 확인한다.
