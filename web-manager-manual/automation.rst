**********************
쿼리 자동화 / 볼륨
**********************

Query Plan (쿼리 자동 실행)
===========================

.. image:: /images/query-plan.png

데이터베이스 → Job automation → **Query Plan** 폴더 우클릭 → **Add Query Plan** 을 선택한다.
Query ID, Username(기본값 "public"), Password, 실행 스케줄(주기, 시각), SQL문을 입력한다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Query ID(질의 ID) \*, Password(비밀번호) \*, SQL문 \* 은 모두 필수이며
    비워두면 각각 "질의 자동화 계획 ID가 필요합니다.", "데이터베이스 비밀번호가 필요합니다.", "SQL 구문을 입력해야
    합니다." 오류가 표시된다. Username은 기본값 "public"이 채워져 있으며 선택 입력이다.

.. note::

    수정 시 Query ID는 읽기 전용이며, Password는 매번 빈 값으로 표시되므로(CMS가 값을 절대 돌려주지 않음) 수정할 때마다 다시 입력해야 한다.

볼륨 추가
=========

.. image:: /images/database-add-volume.png

데이터베이스 → **Space** 폴더 우클릭 → **Add Volume**, 또는 데이터베이스 우클릭 → Manage Database →
**Add Database Volume** — 둘 다 같은 모달을 연다. 필드 설명(Purpose/Path/Size)과 ``addvoldb`` 유틸리티 옵션
대응 관계는 :doc:`database` 의 "볼륨 추가" 절 참고.
