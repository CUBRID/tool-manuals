************************************
데이터베이스 트리 / 라이프사이클
************************************

.. image:: /images/database-tree.png

데이터베이스 노드를 펼치면 **Users**, **Job automation**, **Space** 하위 노드가 나타난다.
우클릭 → **Manage Database** 안에 Unload Database, Load Database, Check Database, Compact Database,
Add Database Volume, Optimize Database, Copy Database, Rename Database, Restore Database, Backup Database,
Delete Database가 있다.

.. note::

    Load/Optimize/Copy/Rename/Restore/Delete는 데이터베이스가 실행 중이면 비활성화된다. 먼저 중지해야 한다.
    반대로 **Database Info** 하위의 Locking Information/Transaction information/Plan Dump는 실행 중일 때만
    활성화된다 (실시간 서버 상태를 조회하는 항목이므로).

로그인 여부 표시
================

데이터베이스 트리의 각 행 이름 옆에 자물쇠 아이콘이 표시된다: 열린 자물쇠(밝은 녹색)는 로그인된 상태, 닫힌 자물쇠(회색)는
로그인되지 않은 상태를 뜻한다.

.. important::

    **해당 데이터베이스에 로그인하지 않은 상태에서는 어떤 작업도 실행할 수 없다.** Start/Stop Database,
    Manage Database의 11개 항목(Unload/Load/Check/Compact/Add Database Volume/Optimize/Copy/Rename/
    Restore/Backup/Delete) 전부, Database Info의 4개 항목(Locking Information/Transaction
    information/Param Dump/Plan Dump), Properties까지 — 예외 없이 로그인 상태를 먼저 요구하며, 로그인
    안 된 상태에서는 메뉴 항목 자체가 비활성화된다.

데이터베이스 생성
==================

.. image:: /images/database-create.png
.. image:: /images/database-create-step2.png
.. image:: /images/database-create-step3.png
.. image:: /images/database-create-step4.png
.. image:: /images/database-create-step5.png

"Databases" 트리 루트 우클릭 → **Create Database** 를 선택하면 5단계 마법사가 열린다:
General Information → Additional Volume Information → Automatic volume extension → Set DBA Password → Database Information(검토).
실제로는 CUBRID의 ``createdb`` 유틸리티를 실행한다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다.

#. **General Information** — Database name(데이터베이스 이름) \* 은 ``createdb`` 의 커맨드라인 인자로 전달된다.
   Locale은 ``createdb`` 의 두 번째 인자(``<데이터베이스 로케일>``, 형식은 ``<language>.<charset>``, 예:
   ``en_US.iso88591``)로 전달된다. Page size는 ``--db-page-size``, Volume size는 ``--db-volume-size``, Volume
   path는 ``-F, --file-path``, Log page size는 ``--log-page-size``, Log volume size는 ``--log-volume-size``,
   Log path는 ``-L, --log-path`` 로 전달된다. "Start database after creation"은 ``createdb`` 옵션이 아니라
   생성 후 api-server가 별도로 수행하는 후속 단계다.
#. **Additional Volume Information** — 추가 볼륨이 필요 없으면 그대로 다음으로 진행한다 (이 단계의 볼륨
   이름/크기/경로는 선택 입력이다). 여기서 입력한 볼륨 목록은 CMS가 제어 파일로 만들어 ``--more-volume-file`` 로
   전달한다.
#. **Automatic volume extension** — 자동 확장 설정(기본값을 그대로 사용해도 된다)을 확인한다. 이 설정은
   ``createdb`` 의 옵션이 아니라 CMS의 별도 자동-볼륨-확장 기능(``setAutoAddVol``)을 구성하는 것이다.
#. **Set DBA Password** — Password/Password Confirm은 **선택 입력**\ 이다. 둘 다 비워두면 DBA 계정에 비밀번호 없이
   생성되며, 값을 입력할 경우에는 8자 이상이어야 하고 Password/Password Confirm이 서로 일치해야 다음 단계로
   진행할 수 있다. 이 역시 ``createdb`` 자체의 옵션이 아니라, 생성 후 별도로 실행되는 사용자 정보 갱신 단계다.
#. **Database Information(검토)** — 요약을 확인하고 **Finish** 를 클릭하면 실제 생성 작업이 시작된다. 완료까지
   최대 2분 정도 걸릴 수 있다.

데이터베이스 로그인
====================

데이터베이스를 더블클릭하면 **Login Database** 모달이 열린다. User name(기본값 "dba")과 Password를 입력한다.
**Save Password** 를 켜두면 다음부터 다시 입력하지 않아도 된다.

.. note::

    User name이 비어 있으면 로그인 버튼을 눌러도 아무 반응이 없다 (오류 메시지 없이 조용히 무시된다). 기본값 "dba"를
    지우지 않는 것을 권장한다. Password는 화면 자체에는 필수 표시가 없다 — 비밀번호가 없는 계정(예: public)은
    비워두고 로그인할 수 있으며, 값이 틀리면 CMS 인증 단계에서 오류가 표시된다.

로그아웃 / 저장된 자격증명 관리
================================

.. image:: /images/database-logout-confirm.png

로그인된 상태에서 우클릭하면 **Logout Database** 가 나타난다. 클릭하면 확인 다이얼로그가 뜨고, 확인하면 로그인 상태만
해제된다 (저장된 비밀번호는 유지된다).

저장된 로그인 프로필이 있는 데이터베이스는 다음 두 항목도 함께 나타난다.

* **Update Database Credentials** — Login Database와 같은 모달을 다시 열어 저장된 사용자명/비밀번호를 갱신한다.
* **Forget Saved Credentials** — 저장된 로그인 프로필 자체를 삭제한다. 다음부터는 다시 수동으로 로그인해야 한다.

.. image:: /images/database-forget-credentials-confirm.png

시작 / 중지
===========

우클릭 시 **Stop Database** 와 **Start Database** 중 정확히 하나만 보이며, 로그인되어 있지 않으면 둘 다 비활성화된다.
클릭하면 바로 실행되지 않고 확인 다이얼로그가 한 번 더 뜬다.

.. image:: /images/database-stop-confirm.png

.. image:: /images/database-start-confirm.png

.. note::

    Copy Database 같은 무거운 작업 직후에는 몇 분간 로그인이 일시적으로 지연될 수 있다. 앱의 문제가 아니라 CMS 호스트 자체의 특성이다.

이름 변경
=========

.. image:: /images/database-rename.png

Manage Database → **Rename Database** (실행 중이면 비활성화). "서비스가 완전히 중지된 상태인지 확인하라"는 경고가 표시된다.
**New Database Name(새 데이터베이스 이름)** \* 은 필수 입력 항목이며, 값을 입력해야 실행 버튼이 활성화된다
(영문자로 시작하는 1~17자의 영문/숫자/밑줄/하이픈만 허용). 실제로는 CUBRID의 ``renamedb`` 유틸리티를 실행하며,
새 이름은 커맨드라인 인자(positional argument)로 그대로 전달된다.

* **Force delete backup volume(백업 볼륨 강제 삭제)** — ``renamedb -d``. 켜면 기존 백업 볼륨을 지운다(공식
  기본값은 "지우지 않음").

.. note::

    확장 볼륨 경로는 화면에 노출되지 않고, 현재 데이터베이스 디렉터리의 상위 디렉터리로 자동 계산되어
    ``renamedb -E`` 로 전달된다. 볼륨별 개별 재배치(``-i, --control-file``)는 이 화면에서 지원하지 않는다.

복사
====

.. image:: /images/database-copy.png

Manage Database → **Copy Database** (원본이 중지 상태여야 한다). 실제로는 CUBRID의 ``copydb`` 유틸리티를
실행한다. 아래 필드는 각각 ``copydb`` 의 옵션 하나에 대응한다(공식 ``--help`` 텍스트 기준).

* **Database Name(대상 데이터베이스 이름)** \* — 필수. 비워두면 실행 버튼을 눌러도 오류 없이 아무 반응이 없다.
  ``copydb`` 의 커맨드라인 인자(positional argument)로 전달된다.
* **File path(파일 경로)** — ``copydb -F``. 데이터베이스가 저장되는 디렉터리 경로.
* **Extend volume path(확장 볼륨 경로)** — ``copydb -E``. 확장 볼륨이 저장되는 디렉터리 경로.
* **Log file path(로그 파일 경로)** — ``copydb -L``. 로그 볼륨이 저장되는 디렉터리 경로. 위 세 경로 필드는 기본값이
  채워져 있으며 선택적으로 수정한다.
* **Copy individual volumes(볼륨별 개별 지정)** — 켜면 위 File path/Extend volume path 대신, 볼륨별로 새 이름과
  경로를 지정하는 표가 나타난다. 이 표의 내용은 ``copydb -i`` (제어 파일)로 전달된다 — 켜져 있으면 File
  path/Extend volume path 필드 자체가 무시된다.
* **Replace existing database(기존 데이터베이스 덮어쓰기)** — ``copydb -r``. 같은 이름의 데이터베이스가 있으면
  덮어쓴다(공식 기본값은 "덮어쓰기 안 함").
* **Delete Source After Copy(복사 후 원본 삭제)** — 위험한 옵션이므로 신중하게 사용한다.

.. warning::

    "Delete Source After Copy"는 ``copydb`` 자체의 원본 삭제 옵션(``-d, --delete-source``)을 쓰지 않는다.
    대신 복사가 끝난 뒤 **별도의 ``cubrid deletedb`` 프로세스** 를 원본 데이터베이스에 대해 추가로 실행하는
    방식으로 동작한다. 즉 복사와 삭제는 하나의 원자적(atomic) 작업이 아니라 순차적인 두 단계이다.

볼륨 추가 (Add Database Volume)
================================

.. image:: /images/database-add-volume.png

Manage Database → **Add Database Volume**. 실제로는 CUBRID의 ``addvoldb`` 유틸리티를 실행한다.

* **Purpose(용도)** — ``addvoldb -p``. 화면에서는 Data/Temp 두 가지만 선택할 수 있다. ``addvoldb`` 자체는
  INDEX/GENERIC까지 총 4가지 값을 허용하지만, 이 화면에서는 그 두 값을 선택할 수 없다.
* **Path(경로)** — ``addvoldb -F``. 저장 경로. 호스트에서 조회한 현재 상태로 자동 채워지며, 존재하지 않으면
  CMS가 생성한다.
* **Size(크기)** — ``addvoldb --db-volume-size``. 프리셋 버튼 또는 직접 입력.
* **Volume name(볼륨 이름)** — 이 화면에는 입력란이 없다. ``addvoldb`` 의 ``-n, --volume-name`` (지정하지 않으면
  ``"db"_ext1`` 형태의 이름이 자동 생성됨)에 빈 값이 전달된다.

.. warning::

    실행하면 실제로 볼륨 파일이 영구적으로 추가된다 — 되돌릴 수 없는 작업이다.

점검 / 압축 / 최적화
======================

.. image:: /images/database-check.png

.. image:: /images/database-compact.png

.. image:: /images/database-optimize.png

Manage Database 안의 **Check Database**, **Compact Database**, **Optimize Database** 는 옵션을 선택하고
실행 버튼을 누르면 작업이 시작되는 진단/유지보수성 실행 다이얼로그이다. 실행하면 진행 상태 모달로 전환되고,
완료되면 성공 모달이 표시된다 (다른 CMS 작업과 동일하게 :doc:`automation` 에서 설명하는 백그라운드 전환도
가능하다). Unload Database의 필드 설명은 :doc:`backup` 참고.

* **Check Database** — 옵션은 **Repair when inconsistency(비일관성 발견 시 복구)** 하나뿐이다. 실제로는
  ``checkdb -r`` 로 전달된다.
* **Compact Database** — 옵션은 **Verbose monitoring(상세 정보 출력)** 하나뿐이다. 실제로는 ``compactdb -v`` 로
  전달된다.
* **Optimize Database** — **Class name(클래스 이름)** 을 지정하면 해당 클래스의 통계 정보만, 비워두면 전체
  클래스의 통계 정보를 갱신한다.

.. note::

    Optimize Database 메뉴 항목은 데이터베이스가 실행 중이면 비활성화된다 — 이 화면에서는 오프라인 상태에서만
    실행할 수 있다.

로드
====

.. image:: /images/database-load.png

Manage Database → **Load Database** (데이터베이스가 중지 상태여야 한다). 자세한 필드 설명은 :doc:`backup` 참고.

삭제
====

.. image:: /images/database-delete.png

Manage Database → **Delete Database** 는 2단계로 진행된다.

#. 삭제될 볼륨 목록과 경고를 확인하고 **Proceed** 를 클릭한다.
#. DBA User name(기본값 "dba")/Password를 다시 입력하고 **Delete** 를 클릭한다. 두 필드 모두 화면 자체의 필수 표시는
   없지만, 값이 올바르지 않으면 인증 단계에서 오류가 표시되어 삭제가 진행되지 않는다.

.. image:: /images/database-delete-confirm.png
