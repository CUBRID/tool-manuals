***************
로그 관리
***************

사이드바 리소스 트리 상단의 세 탭(**Database** / **Broker** / **Log**) 중 **Log** 를 클릭하면
로그 트리로 전환된다. 트리는 세 섹션으로 구성된다: **Broker Logs**, **Manager Logs**, **Server Logs**.

.. image:: /images/log-tree.png

Broker Logs
=============

* **Access** — 접근 로그.
* **Error** — 모든 브로커의 오류 로그 파일 목록. 폴더를 펼치면 각 브로커의 ``.err`` 파일이 나열된다.
* **Admin** — 관리 로그 파일 목록.

폴더 우클릭 시 **Refresh** 로 목록을 다시 불러온다. 개별 파일을 더블클릭하면 Log Viewer 탭이 열린다.

Manager Logs
=============

* **Access log** / **Error log** — CMS(매니저) 자체의 접근/오류 로그. 더블클릭하면 바로 전용 뷰어가 열린다
  (개별 파일 목록이 아니다).

Server Logs
=============

데이터베이스별로 폴더가 나열되며, 펼치면 해당 데이터베이스의 서버 로그 파일 목록이 나온다.
폴더 우클릭 시 **View All Logs** (해당 데이터베이스의 모든 로그 파일을 한 화면에 이어서 표시) 와
**Refresh** 를 선택할 수 있다.

Log Viewer
=============

Broker/Server 로그 파일을 더블클릭하면 열리는 화면으로, 모드 전환 버튼 3개(**Raw Log** / **Parsed SQL** / **Top SQL**)가
있다.

.. note::

    **Parsed SQL** / **Top SQL** 은 브로커 SQL 로그 형식(``execute``/``bind`` 등)을 전제로 파싱한다.
    브로커 SQL 로그가 아닌 파일(관리 로그, 서버 로그 등)에서는 이 두 모드에 결과가 없을 수 있다 —
    이 경우 **Raw Log** 모드를 사용한다.

레벨 필터(All Levels/Error/Warning/Info)와 검색창으로 로그 내용을 좁힐 수 있다.
