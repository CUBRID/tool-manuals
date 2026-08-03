**********************
쿼리 자동화 / 볼륨
**********************

Query Plan (쿼리 자동 실행)
===========================

.. image:: /images/query-plan.png

데이터베이스 → Job automation → **Query Plan** 폴더 우클릭 → **Add Query Plan** 을 선택한다.
Query ID, Username(기본값 "public"), Password, 실행 스케줄(주기, 시각), SQL문을 입력한다.

.. warning::

    Password 필드는 절대 비워두면 안 된다. "public" 계정처럼 원래 비밀번호가 없는 계정이라도 반드시 값을 채워야 저장된다.

.. note::

    수정 시 Query ID는 읽기 전용이며, Password는 매번 빈 값으로 표시되므로(CMS가 값을 절대 돌려주지 않음) 수정할 때마다 다시 입력해야 한다.

볼륨 추가
=========

데이터베이스 → **Space** 폴더 우클릭 → **Add Volume** 을 선택한다. Volume type(Data/Temp), 크기, 이름/경로를 설정한다.

.. warning::

    한 번 추가한 볼륨을 화면에서 삭제하는 기능은 없다. 신중하게 추가한다.
