************
화면 구성
************

.. image:: /images/server-dashboard.png

화면은 크게 네 영역으로 나뉜다.

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 영역
      - 설명
    * - 좌측 사이드바
      - 상단에는 등록된 호스트의 목록을 나타내는 **호스트 목록** 섹션이 있고, 호스트에 로그인하면 그 아래에
        로그인한 호스트의 데이터베이스/브로커/로그 목록(리소스)이 나타난다. 자세한 내용은 :doc:`host`\ ,
        :doc:`database`\ , :doc:`broker`\ , :doc:`logs` 참고.
    * - 상단 메뉴 바
      - 좌측에 **파일(File)** / **호스트 서비스 관리(Host Service Management)** / **도움말(Help)** 드롭다운 메뉴가
        있고, 우측에 언어 전환/다크모드/계정/로그아웃 버튼이 있다. 각 메뉴의 항목은 아래에서 따로 설명한다.
    * - 중앙 탭 영역
      - 호스트/데이터베이스를 열거나 각종 관리 화면을 선택할 때마다 탭으로 쌓이는 공간이다.
    * - 하단 상태 표시줄
      - 사이드바에서 선택된 호스트의 접속 주소:포트(또는 "호스트가 선택되지 않음")와 CUBRID 버전을
        항상 보여준다.

호스트를 더블클릭하면 **호스트 대시보드(Host Dashboard)** 탭이 열린다. 데이터베이스를 더블클릭하면
(데이터베이스 로그인 프로필이 없는 경우 먼저 Login Database 대화창이 뜨고, 로그인 후 다시 더블클릭해야) **데이터베이스 대시보드(Database Dashboard)** 탭이 열린다.

각 탭은 독립적으로 상태가 유지된다.

탭에 저장하지 않은 변경사항(예: Broker/CUBRID Config 편집 중)이 있는 채로 닫으면 **저장하지 않은 변경 사항** 확인 대화창이 뜬다.

파일(File)
===========

상단 메뉴바의 **파일(File)** 메뉴를 클릭하면 아래 항목이 나온다.

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 항목
      - 설명
    * - 호스트 추가(Add Host)
      - :ref:`add-host` 대화창을 연다
    * - 호스트 수정(Edit Host)
      - 사이드바에서 호스트가 선택되어 있어야 활성화된다. :ref:`edit-host` 대화창을 연다
    * - 호스트 내보내기(Export Host)
      - :ref:`export-import-host` 의 내보내기 대화창을 연다
    * - 호스트 가져오기(Import Host)
      - :ref:`export-import-host` 의 가져오기 대화창을 연다

호스트 서비스 관리(Host Service Management)
=============================================

상단 메뉴바의 **호스트 서비스 관리(Host Service Management)** 메뉴를 클릭하면 아래 항목이 나온다.

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 항목
      - 설명
    * - 서비스 대시보드(Service Dashboard)
      - 호스트 선택과 무관하게 항상 사용할 수 있다. :ref:`service-dashboard-section` 을 연다
    * - CMS 계정 관리(CMS Account Management)
      - 사이드바에서 호스트가 선택되어 있고, 그 호스트에 로그인까지 되어 있어야 활성화된다. 우클릭 메뉴의
        :ref:`cms-user-management` 와 같은 대화창을 연다
    * - 설정 파일 편집(Edit Config Files) → CUBRID 설정 편집(Edit Cubrid Config)
      - :ref:`edit-cubrid-config` 화면을 연다
    * - 설정 파일 편집(Edit Config Files) → 브로커 설정 편집(Edit Broker Config)
      - :ref:`broker-config-edit` 화면을 연다
    * - 설정 파일 편집(Edit Config Files) → CM 설정 편집(Edit CM Config)
      - :ref:`edit-cm-config` 화면을 연다

.. note::

    **설정 파일 편집** 하위 세 항목은 사이드바에서 호스트가 선택되어 있지 않아도 항상 클릭할 수 있다 — 다만
    그 상태에서 클릭하면 화면이 열리는 대신 "호스트가 선택되지 않음" 안내 대화창이 뜬다.

도움말 메뉴(Help)
===================

.. image:: /images/navigation-help-menu.png
   :width: 260px

상단 메뉴바의 **도움말(Help)** 메뉴를 클릭하면 아래 항목이 나온다.

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 항목
      - 설명
    * - 도움말(Help)
      - 새 탭에서 https://www.cubrid.org/ 를 연다
    * - 버그 보고(Report Bug)
      - 새 탭에서 CUBRID JIRA(http://jira.cubrid.org/secure/Dashboard.jspa)를 연다
    * - CUBRID 온라인 포럼(CUBRID Online Forum)
      - 새 탭에서 CUBRID Reddit(https://www.reddit.com/r/CUBRID/)을 연다
    * - CUBRID 도구 개발(CUBRID tools developments)
      - 새 탭에서 CUBRID Manager GitHub 저장소(https://github.com/CUBRID/cubrid-manager)를 연다
    * - 업데이트 확인(Check for Updates)
      - 새 버전이 있는지 확인하는 기능. 자세한 내용은 :ref:`unsupported-features` 참고
    * - 호스트 엔진 버전(Host Engine Version)
      - 사이드바에서 호스트가 선택되어 있어야 활성화된다. :ref:`server-version` 참고
    * - CUBRID Admin 정보(About CUBRID Admin)
      - NCA 자체의 버전과 저작권 정보를 보여주는 대화창을 연다. CUBRID 엔진 버전이 아니라 NCA 애플리케이션
        자체의 정보이다(CUBRID 엔진 버전은 위 "Host Engine Version"에서 확인한다)

언어 전환(Language) / 다크모드(Dark Mode) / 로그아웃(Logout)
================================================================

.. image:: /images/auth-header-controls.png

상단 메뉴 바 우측에 **EN** / **KR** 버튼, 화면 테마 전환 버튼, 계정 버튼, **로그아웃(Logout)** 버튼이
순서대로 있다.

* **언어 전환** — **EN** / **KR** 버튼을 클릭하면 새로고침 없이 화면 전체의 언어가 즉시 바뀐다. 선택한
  언어는 브라우저에 저장되어 다음 접속 시에도 유지된다.
* **다크모드/라이트모드** — 언어 전환 버튼 옆 아이콘 버튼으로 밝은/어두운 테마를 전환한다. 최초 접속 시에는
  운영체제(OS)의 다크모드 설정을 따르며, 이후 직접 전환하면 그 설정이 브라우저에 저장되어 다음 접속에도
  유지된다.
* **계정 버튼** — 클릭하면 계정 프로필이 열린다. :ref:`account-profile` 참고.
* **로그아웃** — **로그아웃(Logout)** 버튼을 클릭하면 로그인 화면으로 돌아간다.
