***************
설정 파일 편집
***************

호스트의 CUBRID 엔진, CMS, 브로커가 각각 사용하는 설정 파일을 NCA 화면에서 직접 열어 텍스트 그대로
편집할 수 있다. 상단 메뉴 **호스트 서비스 관리(Host Service Management)** → **설정 파일 편집(Edit Config Files)**
에서 아래 세 화면을 선택할 수 있다(사이드바에서 호스트가 선택되어 있어야 활성화된다).

세 화면 모두 문법 검사 없이 저장한 내용이 즉시 반영되는 순수 텍스트 편집기이며, 되돌리기(Undo) 버튼으로
직전 변경을 취소할 수 있다.

CUBRID 설정 편집
==================

.. image:: /images/server-cubrid-config-edit.png

호스트의 ``cubrid.conf`` 설정 파일(엔진 전역 설정, 데이터베이스별 ``[@dbname]`` 섹션과 공통 ``[common]``
섹션을 포함)을 편집하는 화면이다. **CUBRID 설정 편집(Edit Cubrid Config)** 을 선택하면 열린다.

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.

CM 설정 편집
==============

.. image:: /images/server-cm-config-edit.png

호스트에서 실행 중인 CMS(CUBRID Manager Server) 자체의 설정 파일인 ``cm.conf`` 를 편집하는 화면이다.
**CM 설정 편집(Edit CM Config)** 을 선택하면 열리며, 편집기 화면 구성과 저장 방식은 CUBRID 설정 편집과 동일하다.

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.

브로커 설정 편집
==================

.. image:: /images/broker-config-edit.png

브로커가 사용하는 ``cubrid_broker.conf`` 파일 전체를 편집하는 화면이다. **브로커 설정 편집(Edit Broker Config)**
을 선택하면 열린다. 브로커 탭-스위처 아이콘 우클릭 → "ALL BROKERS" 메뉴에서도 같은 화면을 열 수 있다
(:doc:`broker` 참고).

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.

.. note::

    브로커 하나만 골라 파라미터를 표 형태로 보며 수정하고 싶다면, 파일 전체를 편집하는 이 화면 대신
    :doc:`broker` 의 "브로커 속성(Properties)" 화면을 사용한다 — 그 화면은 선택한 브로커의 섹션만 구조화된
    표로 보여주고, 저장해도 그 브로커의 섹션만 반영된다.
