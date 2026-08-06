:orphan:

Greptile 규칙 검증용 임시 문서 (CMT)
========================================

이 문서는 Greptile 리뷰 규칙 동작을 확인하기 위한 임시 파일이다. 병합하지 않는다.

1. 제품 명칭 (cmt-product-name)
---------------------------------

마이그레이션 툴킷을 실행한 뒤 마법사 화면에서 원본 DBMS를 선택한다.
CUBRID 마이그레이션 도구 모음 설정 파일을 불러온다.
CUBRID Migration Tool 버전을 확인한다.

이 문서는 CUBRID ADMIN 의 백업 절차를 다루지 않는다.

2. 한국어 표기 항목
---------------------

원본 테이블의 컬럼 정의를 확인한 뒤 매개 변수 값을 지정한다.
마이그레이션 중 에러가 발생하면 로그 디렉토리를 확인한다.
데이타 타입 매핑 결과를 검토한다.
커넥션 정보와 디폴트 스키마를 입력한다.

3. UI 라벨과 서술 문장
------------------------

객체 매핑 화면에서 ``Column`` 탭을 선택한다.
위 화면의 컬럼 목록에서 대상을 지정한다.

.. rubric:: "Migration Wizard > Object Mapping > Column Mapping"

4. 영문 표기와 축약형
-----------------------

The source datatype is converted at run-time.
You can't change the mapping after the migration starts.
It's necessary to check the target schema first.
We'll validate the type mapping before the next step.

5. 소유격 (지적 대상이 아니다)
--------------------------------

Oracle's data type is mapped to the CUBRID data type.
The migration script's output is written to the report file.

6. 문체
---------

이 설정을 변경하면 마법사를 다시 실행해야 합니다.

7. 절차 안전성 (doc-procedure-safety)
----------------------------------------

대상 스키마를 덮어쓰려면 마법사에서 Overwrite 옵션을 선택한다.

이 도구는 모든 DBMS를 100% 완벽하게 이관한다.

8. 지적하면 안 되는 항목
--------------------------

원본 타입 ``NUMBER`` 는 대상 타입 ``NUMERIC`` 으로 매핑된다.
``VARCHAR2`` 와 ``TINYINT`` 는 각 제품의 공식 표기이므로 그대로 쓴다.
JDBC 드라이버 클래스는 ``com.mysql.cj.jdbc.Driver`` 이다.
접속 URL은 ``jdbc:cubrid:localhost:33000:demodb:::`` 형태로 지정한다.

.. code-block:: console

   ./migration.sh -f migration_config.xml

.. code-block:: text

   [INFO] Migration completed. 1024 rows transferred.
