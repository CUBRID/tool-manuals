******************
화면 구성 / 탭
******************

.. image:: /images/server-dashboard.png

화면은 크게 네 영역으로 나뉜다.

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 영역
      - 설명
    * - 좌측 사이드바
      - 상단에는 등록된 호스트의 목록을 나타내는 **서버 목록** 섹션이 있고, 호스트에 로그인하면 그 아래에
        로그인한 호스트의 데이터베이스/브로커/로그 목록(리소스)이 나타난다. 자세한 내용은 :doc:`host`\ ,
        :doc:`database`\ , :doc:`broker`\ , :doc:`logs` 참고.
    * - 상단 메뉴 바
      - **파일(File)** / **호스트 서비스 관리(Host Service Management)** / **도움말(Help)** 드롭다운 메뉴가 있고,
        우측에는 언어 전환(EN/KR), 다크모드 토글, 계정 pill(클릭하면 계정 프로필이 열린다, :doc:`auth` 참고),
        로그아웃 버튼이 순서대로 있다.
    * - 중앙 탭 영역
      - 호스트/데이터베이스를 열거나 각종 관리 화면을 선택할 때마다 탭으로 쌓이는 공간이다.
    * - 하단 상태 표시줄
      - 사이드바에서 선택된 호스트의 접속 주소:포트(또는 "호스트가 선택되지 않음")와 CUBRID 버전을
        항상 보여준다.

호스트를 더블클릭하면 **서버 대시보드(Server Dashboard)** 탭이 열린다. 데이터베이스를 더블클릭하면
(데이터베이스 로그인 프로필이 없는 경우 먼저 Login Database 대화창이 뜨고, 로그인 후 다시 더블클릭해야) **데이터베이스 대시보드(Database Dashboard)** 탭이 열린다.

각 탭은 독립적으로 상태가 유지된다.

탭에 저장하지 않은 변경사항(예: Broker/CUBRID Config 편집 중)이 있는 채로 닫으면 **저장하지 않은 변경 사항** 확인 대화창이 뜬다.

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
      - 새 버전이 있는지 확인하는 기능이나, 현재는 비활성화되어 있다
    * - 서버 버전(Server Version)
      - 사이드바에서 호스트가 선택되어 있어야 활성화된다. :doc:`host` 의 "서버 버전" 절 참고
    * - CUBRID Admin 정보(About CUBRID Admin)
      - NCA 자체의 버전과 저작권 정보를 보여주는 대화창을 연다. CUBRID 엔진 버전이 아니라 NCA 애플리케이션
        자체의 정보이다(CUBRID 엔진 버전은 위 "Server Version"에서 확인한다)
