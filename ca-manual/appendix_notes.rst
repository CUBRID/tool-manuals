부록. 운영 참고 사항
=======================================


1. 한국어 외래어 표기
------------------------------------------

서버 기동 중 에러가 발생하면 로그를 확인한다.
테이블의 컬럼 정의를 먼저 확인한다.
파라메터 값을 확인한 뒤 서비스를 재시작한다.
로그 디렉토리 위치를 확인한다.
해당 메소드는 처리 결과를 리턴한다.
데이타 파일과 메세지 파일을 분리한다.
쓰레드 개수와 캐쉬 크기를 조정한다.
어플리케이션 코드에 커멘트를 추가한다.
엔클러저 장치 상태를 점검한다.

2. 용어 통일과 띄어쓰기
----------------------------------------------

매개 변수 값을 변경한 뒤 서비스를 재시작한다.
매개변수 목록은 다음과 같다.
서브 쿼리 성능을 확인한다.
서브쿼리 실행 계획을 점검한다.
하위 질의 결과를 임시 테이블에 저장한다.
슬로우쿼리 로그를 분석한다.
느린 질의 목록을 추출한다.
느린 쿼리 임계값을 조정한다.
스토리지 용량과 디폴트 설정을 확인한다.
커넥션 수를 제한한 뒤 셧다운 절차를 진행한다.
운영체제 종류에 따라 소스코드 경로가 다르다.
데이터 베이스 이름을 지정한다.

3. 한국어 문맥 판단 항목
-----------------------------------------------

쿼리 실행 시간을 측정한다.
유저 권한과 리소스 사용량을 먼저 확인한다.
자세한 내용은 CUBRID 레퍼런스 매뉴얼을 참고한다.
대상 리스트를 화면에서 선택한다.

4. 영문 표기
---------------------------------------------------

Check the host name and user name before service start-up.
The file name is resolved at run-time.
This value can not be changed after the datatype is fixed.
The indices are rebuilt during the back-up process.

5. 영문 축약형
----------------------------------------

You can't modify this value while the server is running.
It's recommended to stop the service first.
I'm going to describe the restore procedure in this section.
We'll check the archive log before the recovery starts.
I've verified the backup volume.
If the volume were full, he'd need to add a new one.
Let's review the configuration.
The value doesn't change after the server starts.

6. 소유격 표현
--------------------------------

The user's password is stored in the system catalog.
Oracle's data type is mapped to the CUBRID data type.
The database's owner can grant privileges to other users.

7. 인코딩 표기
--------------------------------------------

데이터베이스 문자셋을 UTF8로 지정하면 다국어 데이터를 저장할 수 있다.
euckr 인코딩을 사용하는 기존 데이터베이스는 그대로 유지한다.

.. code-block:: console

   cubrid createdb --db-locale=ko_KR.eucKR testdb
   cubrid createdb --db-locale=ko_KR.UTF-8 testdb2

8. 제품 명칭
--------------------------------

CUBRID ADMIN 을 실행한 뒤 워크스페이스를 선택한다.
큐브리드 어드민 화면에서 호스트를 추가한다.

이 문서는 CUBRID Migration Tool 과 마이그레이션 툴킷 사용법을 다루지 않는다.

9. 문체
-------------------------------------

이 값을 변경하면 서비스를 재시작해야 합니다.
자세한 내용은 다음 절에서 설명합니다.

10. 절차 안전성
----------------------------------------

데이터베이스를 삭제하려면 다음 명령을 실행한다.

.. code-block:: console

   cubrid deletedb testdb

cubrid restoredb 명령을 사용하면 완벽한 복구가 가능하고 데이터 손실이 절대 발생하지 않는다.

11. 코드와 설정값 표기
---------------------------

.. rubric:: "호스트 이름 (마우스 우클릭) > 속성 > 매개 변수 구성 (더블 클릭) > 서비스 구동 설정"

위 화면에서 "사용 중인 매개 변수" 항목을 선택한다.

``error_log`` 파라미터는 오류 로그 파일의 경로를 지정한다.
로케일 옵션값은 ``ko_KR.euckr`` 형태로 지정한다.
``db_class`` 카탈로그에서 테이블 목록을 조회한다.
``CUBRID_DATABASES`` 환경 변수 값을 확인한다.

.. code-block:: text

   ERROR: cannot open the database. check the error log.
   Num_data_page_fetches: 1024
   LOCK ESCALATION on the class

12. 추가 설명
-----

제목 밑줄 길이가 제목 텍스트 폭보다 짧다.
