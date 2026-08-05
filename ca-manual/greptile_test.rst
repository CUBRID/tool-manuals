  Greptile 규칙 검증용 임시 문서
  ==============================================

  이 문서는 Greptile 리뷰 규칙 동작을 확인하기 위한 임시 파일이다. 병합하지 않는다.

  1. 한국어 AUTO 항목
  --------------------------------

  서버 기동 중 에러가 발생하면 로그를 확인한다.
  테이블의 컬럼 정의를 먼저 확인한다.
  매개 변수 값을 변경한 뒤 서비스를 재시작한다.
  로그 디렉토리 위치를 확인한다.
  해당 메소드는 처리 결과를 리턴한다.
  데이타 파일과 메세지 파일을 분리한다.
  쓰레드 개수는 디폴트 값을 사용한다.
  운영체제 종류에 따라 소스코드 경로가 다르다.

  2. 한국어 MANUAL 항목
  --------------------------------

  느린 쿼리를 추적하려면 유저 권한을 먼저 확인한다.
  자세한 내용은 CUBRID 레퍼런스 매뉴얼을 참고한다.

  3. 영문 항목
  --------------------------------

  Check the host name and user name before service start-up.
  You can't modify this value at run-time.
  This value can not be changed after the datatype is fixed.

  4. 인코딩 표기
  --------------------------------

  데이터베이스 문자셋을 UTF8로 지정하면 다국어 데이터를 저장할 수 있다.
  euckr 인코딩을 사용하는 기존 데이터베이스는 그대로 유지한다.

  .. code-block:: console

     cubrid createdb --db-locale=ko_KR.eucKR testdb
     cubrid createdb --db-locale=ko_KR.UTF-8 testdb2

  5. 문체
  --------------------------------

  이 값을 변경하면 서비스를 재시작해야 합니다.
  자세한 내용은 다음 절에서 설명합니다.

  6. 보증성 표현
  --------------------------------

  cubrid restoredb 명령을 사용하면 완벽한 복구가 가능하고 데이터 손실이 절대 발생하지 않는다.

  7. 지적하면 안 되는 항목
  --------------------------------

  .. rubric:: "호스트 이름 (마우스 우클릭) > 속성 > 매개 변수 구성 (더블 클릭) > 서비스 구동 설정"

  위 화면에서 "사용 중인 매개 변수" 항목을 선택한다.

  ``error_log`` 파라미터는 오류 로그 파일의 경로를 지정한다.
  로케일 옵션값은 ``ko_KR.euckr`` 형태로 지정한다.

  .. code-block:: text

     ERROR: cannot open the database. check the error log.
     Num_data_page_fetches: 1024

  8. RST 문법 오류
  -----

  제목 밑줄 길이가 제목 텍스트 폭보다 짧다.
