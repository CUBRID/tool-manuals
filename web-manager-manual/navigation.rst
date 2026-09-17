******************
화면 구성 / 탭
******************

.. image:: /images/main-layout.png

호스트를 더블클릭하면 **서버 대시보드(Server Dashboard)** 탭이 열린다. 데이터베이스를 더블클릭하면
(로그인 프로필이 없는 경우 먼저 Login Database 모달이 뜨고, 로그인 후 다시 더블클릭해야) **데이터베이스 대시보드(Database Dashboard)** 탭이 열린다.

각 탭은 독립적으로 상태가 유지되며, 탭의 ``×`` 로 닫을 수 있다.

탭에 저장하지 않은 변경사항(예: Broker/Cubrid Config 편집 중)이 있는 채로 닫으면 **Discard Changes?** 확인 모달이 뜬다.
**취소(Cancel)** 을 누르면 닫지 않고 유지되고, **버리기(Discard)** 를 누르면 변경사항을 버리고 닫힌다.

도움말 메뉴 (Help)
====================

.. image:: /images/navigation-help-menu.png
   :width: 260px
   :align: left

상단 메뉴바의 **도움말(Help)** 메뉴를 클릭하면 아래 항목이 나온다.

* **도움말(Help)** — 새 탭에서 https://www.cubrid.org/ 를 연다.
* **버그 보고(Report Bug)** — 새 탭에서 CUBRID JIRA(http://jira.cubrid.org/secure/Dashboard.jspa)를 연다.
* **CUBRID 온라인 포럼(CUBRID Online Forum)** — 새 탭에서 CUBRID Reddit(https://www.reddit.com/r/CUBRID/)을 연다.
* **CUBRID 도구 개발(CUBRID tools developments)** — 새 탭에서 CUBRID Manager GitHub 저장소(https://github.com/CUBRID/cubrid-manager)를
  연다.
* **업데이트 확인(Check for Updates)** — 항상 비활성화되어 있다. 클릭해도 아무 동작이 일어나지 않는다.
* **서버 버전(Server Version)** — 사이드바에서 호스트가 선택되어 있어야 활성화된다. :doc:`host` 의 "서버 버전" 절 참고.
* **CUBRID Admin 정보(About CUBRID Admin)** — NCA 자체의 버전과 저작권 정보를 보여주는 모달을 연다. CUBRID 엔진 버전이 아니라
  NCA 애플리케이션 자체의 정보이다(CUBRID 엔진 버전은 위 "Server Version"에서 확인한다).

.. raw:: html

   <div style="clear: both;"></div>
