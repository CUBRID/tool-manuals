***************
호스트 관리
***************

호스트 관리 화면은 NCA가 관리할 CUBRID 호스트를 등록·삭제하고 그룹으로 묶어 관리한다. 여기서 "호스트에 로그인"한다는 것은
NCA 서버가 해당 호스트에서 실행 중인 CMS(CUBRID Manager Server)의 API에 접속하는 것이며, CUBRID 엔진에 직접 접속하는
것이 아니다.

.. toctree::
    :hidden:

    server_dashboard.rst
    config_editor.rst
    host_operations.rst

사이드바 상단 섹션명은 **호스트 목록(Host List)** 이다.

.. image:: /images/host-tree.png

호스트를 우클릭하거나 툴바에서 사용할 수 있는 개별 작업은 다음과 같다 (각 화면별 사용법은
:doc:`host_operations` 참고).

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 기능
      - 설명
    * - 호스트 추가(Add Host)
      - 새 CUBRID 호스트 연결 정보를 등록한다
    * - 호스트 수정(Edit Host)
      - 등록된 호스트의 연결 정보를 수정한다
    * - 호스트 삭제(Delete Host)
      - 등록된 호스트 연결을 제거한다
    * - 전체 로그인(Login All)
      - 로그인 안 된 호스트 전체에 한 번에 로그인한다
    * - 그룹 생성/이름 변경(New/Rename Group)
      - 호스트를 묶을 그룹을 만들거나 이름을 바꾼다
    * - 그룹 삭제(Delete Group)
      - 그룹과 그 안의 호스트를 함께 삭제한다
    * - 그룹 멤버 관리(Manage Group)
      - 호스트를 그룹에 넣거나 뺀다
    * - CMS 사용자 관리(User Management)
      - 호스트에 연결된 CMS 관리자 계정을 관리한다
    * - 비밀번호 변경(Change Password)
      - 호스트의 CMS 관리자 비밀번호를 바꾼다
    * - 호스트 내보내기/가져오기(Export/Import Host)
      - 등록된 호스트 목록을 파일로 내보내거나 파일에서 가져온다

.. _server-version:

호스트 엔진 버전(Host Engine Version)
========================================

.. image:: /images/host-server-version.png

호스트 우클릭 → **호스트 엔진 버전(Host Engine Version)** 을 선택하거나, 상단 **도움말(Help)** 메뉴 → **호스트 엔진 버전(Host Engine Version)** 을 선택하면(이 경우
사이드바에서 호스트가 선택되어 있어야 활성화된다) 열린다. CMS에서 조회한 환경 정보를 보여주는 읽기 전용 화면이다.

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 항목
      - 설명
    * - CUBRID 버전(CUBRID Version)
      - CUBRID 엔진 버전
    * - OS(OS Platform)
      - 호스트의 OS/플랫폼 정보
    * - 브로커(Broker)
      - 브로커 버전
    * - 설치 경로(Install Path)
      - CUBRID 설치 경로
    * - 데이터베이스(Databases)
      - 데이터베이스가 저장되는 경로

다중 호스트 선택(일괄 작업)
============================

.. image:: /images/host-bulk-select.png
   :width: 420px

Ctrl/Cmd-클릭으로 호스트를 하나씩 추가 선택하거나, Shift-클릭으로 마지막에 클릭한 호스트부터 범위 선택할 수 있다
(그룹이 달라도 함께 선택 가능하다).

선택된 상태에서 우클릭하면 다음과 같은 일괄 작업 메뉴가 뜬다.

.. image:: /images/host-bulk-context-menu.png
   :width: 240px

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 항목
      - 설명
    * - 선택한 호스트 로그인(Login Selected Hosts)
      - 선택된 호스트 중 아직 로그인되지 않은 것만 로그인한다 (이미 로그인된 호스트는 건너뛴다).
    * - 그룹으로 이동(Move to Group)
      - 하위 메뉴에서 "Ungrouped" 또는 기존 그룹 중 하나를 선택하면 선택된 호스트 전부가 그 그룹으로 이동한다.
    * - 선택한 호스트 삭제(Delete Selected Hosts)
      - 확인 대화창이 뜨며, 선택한 호스트 개수가 표시된다.

**선택한 호스트 삭제** 를 누르면 다음 확인 대화창이 뜬다.

.. image:: /images/host-bulk-delete-confirm.png
   :width: 420px

.. warning::

    선택한 호스트 전부의 연결 정보와 저장된 자격 증명/설정 프로필이 함께 영구 삭제되며, 되돌릴 수 없다.

호스트 추가/수정/삭제, 그룹 관리, CMS 사용자 관리, 내보내기/가져오기 등 개별 작업의 화면별 사용법은
:doc:`host_operations` 참고.
