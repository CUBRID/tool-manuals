# CUBRID 도구 매뉴얼 작성 표기 표준

> 적용 대상: `CUBRID/tool-manuals` 저장소의 모든 `.rst` 문서
> 근거: [CUBRIDMAN-343](http://jira.cubrid.org/browse/CUBRIDMAN-343)
> 이 문서는 표기 표준의 **정본**입니다. Greptile 리뷰 규칙(`.greptile/rules.md`)과 내용이 어긋나면 이 문서를 우선합니다.

---

## 목차

1. [이 문서를 읽는 이유](#1-이-문서를-읽는-이유)
2. [모드 구분](#2-모드-구분)
3. [한국어 표기 규칙 34개](#3-한국어-표기-규칙-34개)
   - [3-1. `query` 번역 판정 순서](#3-1-query-번역-판정-순서)
4. [영문 표기 규칙 34개](#4-영문-표기-규칙-34개)
   - [4-1. 영문 축약형 금지](#4-1-영문-축약형-금지)
5. [문자 인코딩 표기 기준](#5-문자-인코딩-표기-기준)
6. [표기 규칙 적용 제외 대상](#6-표기-규칙-적용-제외-대상)
7. [reStructuredText 작성 규칙](#7-restructuredtext-작성-규칙)
8. [고객 리스크 표현](#8-고객-리스크-표현)
9. [작성자 셀프 체크 절차](#9-작성자-셀프-체크-절차)
10. [Greptile 자동 리뷰 연동](#10-greptile-자동-리뷰-연동)
11. [표준 변경 절차](#11-표준-변경-절차)

---

## 1. 이 문서를 읽는 이유

매뉴얼은 고객사와 평가위원이 읽는 문서입니다. 같은 개념을 문서마다 다르게 부르면
독자는 서로 다른 기능으로 오해합니다. 표기 통일은 문체 취향이 아니라 **기술 정합성 문제**입니다.

이 표준은 사후 일괄 수정 PR을 줄이기 위한 것입니다.
작성 시점에 이 문서를 참조하면 리뷰 왕복이 사라집니다.

---

## 2. 모드 구분

| 모드 | 의미 | Greptile 심각도 | 작성자 대응 |
|:---|:---|:---:|:---|
| `AUTO` | 문맥과 무관하게 항상 틀린 표기 | `high` | **반드시 수정** |
| `WORD` | 단어 경계 기준으로 판단 | `high` | 단어 경계 확인 후 수정 |
| `MANUAL` | 문맥에 따라 유지 가능 | `low` | 예외 조건 확인 후 판단 |

`MANUAL` 항목에서 원문을 유지하기로 판단했다면, PR 코멘트에 **유지 이유를 남깁니다.**
같은 판단이 반복되면 11절 절차로 예외를 표준에 반영합니다.

### 봇 코멘트에서 두 유형을 구분하는 방법

Greptile은 두 유형을 **별도 코멘트로 분리**하도록 설정되어 있습니다. 코멘트 제목으로 구분합니다.

| 코멘트 제목 | 해당 모드 | 대응 |
|:---|:---|:---|
| `[표기 표준 위반]` | `AUTO`, `WORD` | 수정합니다 |
| `[문맥 확인 필요]` | `MANUAL` | 예외 조건을 확인하고 판단합니다 |

> 배지 등급(P1~P4)은 `severity` 설정값과 일치하지 않습니다.
> 배지는 Greptile이 자체 판단하므로 **등급이 아니라 코멘트 제목으로 판단하십시오.**
> `AUTO` 항목이 P2로 표시되어도 수정 대상입니다.

한 코멘트에 두 유형이 섞여 있으면 설정 오류입니다. 답글로 알려 주십시오.

---

## 3. 한국어 표기 규칙 34개

| 번호 | 오류 표기 | 권장 표기 | 모드 | 예외 및 비고 |
|:---:|:---|:---|:---:|:---|
| 1 | 에러 | 오류 | AUTO | |
| 2 | 컬럼 | 칼럼 | AUTO | 이미지 파일명, SQL 식별자, UI 라벨 인용은 제외 |
| 3 | 매개 변수 | 파라미터 | AUTO | |
| 4 | 서브 쿼리 | 부질의 | AUTO | |
| 5 | 슬로우쿼리 | 슬로우 쿼리 | AUTO | 원어 `slow query`가 두 단어이므로 띄어 씀 |
| 6 | 쿼리 | 질의 | MANUAL | **`슬로우 쿼리`, `부질의`는 유지.** 제품 UI 명칭·옵션명의 query는 유지. 3-1절 참조 |
| 7 | 리턴 | 반환 | AUTO | |
| 8 | 커멘트 | 주석 | AUTO | |
| 9 | 쓰레드 | 스레드 | AUTO | |
| 10 | 리소스 | 자원 | MANUAL | 옵션값·경로·API 이름의 resource는 유지 |
| 11 | 메소드 | 메서드 | AUTO | |
| 12 | 디렉토리 | 디렉터리 | AUTO | 경로 문자열은 제외 |
| 13 | 메세지 | 메시지 | AUTO | |
| 14 | 유저 | 사용자 | MANUAL | DB 계정명, 옵션명 `user`/`username`은 유지 |
| 15 | 파라메터 | 파라미터 | AUTO | |
| 16 | 레퍼런스 | 참조 | MANUAL | `CUBRID 레퍼런스 매뉴얼`처럼 공식 문서 제목은 유지 |
| 17 | 데이타 | 데이터 | AUTO | |
| 18 | 툴킷 | 도구 모음 | MANUAL | **`CUBRID Migration Toolkit`은 제품 정식 명칭이므로 유지** |
| 19 | 스토리지 | 저장소 | AUTO | |
| 20 | 디폴트 | 기본값 | AUTO | |
| 21 | 커넥션 | 연결 | AUTO | |
| 22 | 캐쉬 | 캐시 | AUTO | |
| 23 | 어플리케이션 | 애플리케이션 | AUTO | |
| 24 | 셧다운 | 종료 | AUTO | |
| 25 | 엔클러저 | 인클로저 | AUTO | |
| 26 | 운영체제 | 운영 체제 | AUTO | 띄어 씀 |
| 27 | 소스코드 | 소스 코드 | AUTO | 띄어 씀 |
| 28 | 데이터 베이스 | 데이터베이스 | AUTO | 붙여 씀 |
| 29 | 서브쿼리 | 부질의 | AUTO | |
| 30 | 하위 질의 | 부질의 | AUTO | |
| 31 | 느린 질의 | 슬로우 쿼리 | AUTO | |
| 32 | 매개변수 | 파라미터 | AUTO | |
| 33 | 리스트 | 목록 | MANUAL | UI 컨트롤명(List Box), 자료형 `list`는 유지 |
| 34 | 느린 쿼리 | 슬로우 쿼리 | AUTO | 31번(느린 질의)과 동일 대상 |

### 규칙 간 우선순위

규칙이 서로 충돌할 때의 적용 순서입니다.

1. **제품 정식 명칭** — 모든 규칙보다 우선합니다.
2. **복합어 규칙** — 5·31·34번(`슬로우 쿼리`), 4·29·30번(`부질의`)이 6번(`쿼리 → 질의`)보다 우선합니다.
3. **단일어 규칙** — 6번 등 나머지.

```text
슬로우쿼리    → 슬로우 쿼리     (O)  5번 적용
슬로우 쿼리   → 슬로우 질의     (X)  6번을 잘못 적용
느린 쿼리     → 슬로우 쿼리     (O)  34번 적용
느린 쿼리     → 느린 질의       (X)  6번을 먼저 적용해 두 단계로 나눔
서브 쿼리     → 부질의          (O)  4번 적용
서브 쿼리     → 서브 질의       (X)  6번을 잘못 적용
```

---

## 3-1. `query` 번역 판정 순서

같은 `query`가 본문에서 `질의`, `부질의`, `쿼리` 세 가지로 나타납니다.
임의 선택이 아니라 다음 순서로 판정한 결과입니다.

| 순서 | 판정 기준 | 결과 | 예 |
|:---:|:---|:---|:---|
| 1 | 제품이 영문 식별자로 노출하는 **기능 명칭**인가 | 음차 유지 + 원어 띄어쓰기 | `슬로우 쿼리` |
| 2 | 순화어가 이미 **정착한 복합어**인가 | 순화어 사용 | `부질의` |
| 3 | 그 외 일반 명사 | 순화 | `질의` |

### 왜 `슬로우 쿼리`는 `슬로우 질의`가 아닌가

`쿼리 → 질의`(6번)를 적용하면 `슬로우 질의`가 되어야 논리적으로 일관됩니다.
그렇게 하지 않는 이유는 이 용어가 제품 식별자와 직접 연결되기 때문입니다.

| 위치 | 식별자 |
|:---|:---|
| `cubrid.conf` | `sql_trace_slow` |
| `cubrid_broker.conf` | `SLOW_LOG`, `LONG_QUERY_TIME` |
| JDBC / CCI 연결 URL | `logSlowQueries`, `slowQueryThresholdMillis` |

`슬로우 질의`로 표기하면 독자가 위 파라미터를 문서에서 찾지 못합니다.
`느린 질의`도 같은 문제가 있고, 형용사+명사 서술구로 읽혀 고유 개념 명칭으로 기능하지 않습니다.

### 왜 붙여 쓰지 않는가

원어 `slow query`가 두 단어이고, 한글 맞춤법 제2항은 단어별 띄어쓰기를 원칙으로 합니다.
붙여쓰기는 한 단어로 굳은 경우에 한하는데 `슬로우쿼리`는 사전 등재어가 아닙니다.

첫 등장 시 `슬로우 쿼리(slow query)`로 원어를 병기합니다.

### 실측 근거 (develop 기준)

| 표기 | `cubrid-manual` `ko` | `tool-manuals` |
|:---|---:|---:|
| 질의 | 1,475 | 44 |
| 쿼리 | 260 | 9 |
| 부질의 | 197 | — |
| 서브 쿼리 / 서브쿼리 / 하위 질의 | 28 / 9 / 11 | — |
| **슬로우 쿼리** | **21** | 0 |
| 슬로우쿼리 | 0 | 0 |
| 느린 질의 | 1 | 0 |

`부질의`는 197건 대 48건이므로 2번 기준(정착한 순화어)이 성립합니다.
`슬로우 쿼리`는 21건 대 0건이므로 붙여쓰기 표기를 표준으로 삼을 근거가 없습니다.
`tool-manuals`에는 네 표기 모두 0건이므로 5·31·34번은 이 저장소에서 **예방 목적** 규칙입니다.

---

## 4. 영문 표기 규칙 34개

| 번호 | 오류 표기 | 권장 표기 | 모드 | 예외 및 비고 |
|:---:|:---|:---|:---:|:---|
| 1 | host name | hostname | AUTO | 옵션명 `host-name`은 제외 |
| 2 | user name | username | AUTO | 릴리스 노트·dba 문맥 확인 |
| 3 | file name | filename | AUTO | |
| 4 | auto-commit | autocommit | MANUAL | `;autocommit`, `--no-auto-commit` 제외 |
| 5 | auto commit | autocommit | MANUAL | 위와 동일 |
| 6 | time zone | timezone | AUTO | |
| 7 | fail-over | failover | AUTO | |
| 8 | sub-query | subquery | AUTO | |
| 9 | upper case | uppercase | AUTO | |
| 10 | upper-case | uppercase | AUTO | |
| 11 | white space | whitespace | AUTO | |
| 12 | multi-byte | multibyte | AUTO | |
| 13 | look-up | lookup | AUTO | |
| 14 | run-time | runtime | AUTO | |
| 15 | start-up | startup | AUTO | |
| 16 | log-in | login | AUTO | |
| 17 | type-cast | typecast | AUTO | |
| 18 | datatype | data type | WORD | 코드·API 식별자, 타입 매핑 표는 유지 |
| 19 | data base | database | AUTO | |
| 20 | meta-data | metadata | AUTO | |
| 21 | on-line | online | AUTO | |
| 22 | back-up | backup | AUTO | |
| 23 | can not | cannot | WORD | |
| 24 | can't 등 축약형 | cannot 등 원형 | AUTO | 전용 규칙 `en-contraction-guard`, 4-1절 참조 |
| 25 | centre | center | MANUAL | 예제 데이터 값은 제외 |
| 26 | indices | indexes | WORD | 수학적 지수 문맥은 `indices` 유지 |
| 27 | Cubrid | CUBRID | MANUAL | 클래스명(`SpCubrid`), 패키지 경로, SQL 예제는 유지 |
| 28 | Id | ID | MANUAL | 코드 식별자·필드명의 `Id`는 유지 |
| 29 | UTF8 | UTF-8 | MANUAL | 5절 참조 |
| 30 | utf-8 | UTF-8 | MANUAL | 5절 참조 |
| 31 | euckr | EUC-KR | MANUAL | 5절 참조 (옵션값은 유지) |
| 32 | eucKR | euckr | MANUAL | 5절 참조 (옵션값은 유지) |
| 33 | EUCKR | EUC-KR | MANUAL | 5절 참조 (옵션값은 유지)  |
| 34 | UTF-8 | utf8 | MANUAL | 5절 참조 (옵션값은 유지) |

### 4-1. 영문 축약형 금지

영문 서술 문장에 축약형을 사용하지 않습니다. 매뉴얼은 격식체 기술 문서이므로 원형을 씁니다.

| 축약형 | 원형 | 축약형 | 원형 |
|:---|:---|:---|:---|
| can't | cannot | isn't | is not |
| won't | will not | aren't | are not |
| don't | do not | wasn't | was not |
| doesn't | does not | weren't | were not |
| didn't | did not | hasn't | has not |
| shouldn't | should not | haven't | have not |
| wouldn't | would not | hadn't | had not |
| couldn't | could not | mustn't | must not |
| it's | it is | that's | that is |
| there's | there is | let's | let us |
| you're | you are | they're / we're | they are / we are |

**소유격은 축약형이 아닙니다.** 아포스트로피가 있어도 수정하지 않습니다.

```text
user's password        (O) 소유격 — 유지
Oracle's data type     (O) 소유격 — 유지
the database's owner   (O) 소유격 — 유지
it's not supported     (X) it is not supported
```

제외 대상은 6절과 같습니다. 추가로 외부 문서·표준 문서에서 그대로 인용한 문장도 제외합니다.

> `develop` 기준 현재 본문의 축약형은 **0건**입니다. 이 규칙은 유입 방지 목적이며 일괄 수정 대상이 없습니다.

---

## 5. 문자 인코딩 표기 기준

29~34번은 **서로 반대 방향의 규칙**을 포함합니다.
`UTF8 → UTF-8`(29번)과 `UTF-8 → utf8`(34번)이 동시에 존재하므로,
찾아 바꾸기로 일괄 치환하면 반드시 문서가 깨집니다.

### 판정 순서

```
① 이 문자열이 명령어·옵션값·설정 파일 예제 안에 있는가?
     └ YES → 소문자, 하이픈 없음
              utf8 / euckr / ko_KR.euckr / ko_KR.utf8
② 이 문자열이 일반 설명 문장 안에 있는가?
     └ YES → IANA 표준 명칭
              UTF-8 / EUC-KR
③ 옵션값 자리에는 하이픈 표기를 절대 쓰지 않는다.
```

CUBRID는 인코딩 이름의 대소문자를 구분하지 않지만, **문서 표기는 위 기준 하나로 통일**합니다.

> **이 규칙은 6절 제외 대상의 유일한 예외입니다.**
> 옵션값 예제가 코드 블록이나 인라인 리터럴 안에 있어도 하이픈 표기라면 수정 대상입니다.
> 다른 표기 규칙은 코드 블록 안에서 적용하지 않습니다.

### 적용 예

| 위치 | 잘못된 예 | 올바른 예 |
|:---|:---|:---|
| 설명 문장 | 문자셋을 UTF8로 지정합니다. | 문자셋을 UTF-8로 지정합니다. |
| 설명 문장 | euckr 인코딩을 지원합니다. | EUC-KR 인코딩을 지원합니다. |
| 설명 문장 | EUCKR 데이터베이스를 생성합니다. | EUC-KR 데이터베이스를 생성합니다. |
| 옵션값 | `--db-locale=ko_KR.eucKR` | `--db-locale=ko_KR.euckr` |
| 옵션값 | `--db-locale=ko_KR.EUC-KR` | `--db-locale=ko_KR.euckr` |
| 옵션값 | `charset=UTF-8` | `charset=utf8` |

### 한 문장 안에 둘 다 나오는 경우

```rst
EUC-KR 인코딩을 사용하려면 ``--db-locale=ko_KR.euckr`` 옵션을 지정합니다.
```

설명 부분은 `EUC-KR`, 옵션값은 `euckr`입니다. **둘을 통일하려 하지 마십시오.**

---

## 6. 표기 규칙 적용 제외 대상

다음 위치의 문자열은 **표기 규칙 대상이 아닙니다.** 원문을 그대로 유지합니다.

| 구분 | 내용 |
|:---|:---|
| 코드 블록 | `.. code-block::`, `.. literalinclude::`, `::` 리터럴 블록 내부 |
| 인라인 리터럴 | 이중 백틱으로 감싼 부분 |
| 명령어 | 유틸리티 명령, 하위 명령, 실행 옵션명과 옵션값 |
| 설정 | 시스템 파라미터명, 설정 파일 키, 환경 변수명과 값 |
| SQL | 예약어, 스키마/테이블/칼럼 식별자, 예제 데이터 값 |
| 제품 출력 | 오류 메시지, 로그, 모니터링 지표명, 리포트 출력 |
| 경로 | 파일명, 디렉터리 경로, URL, 이미지 파일 경로 |
| Sphinx 문법 | `:ref:`, `:option:`, `:file:`, `:menuselection:` 등의 타깃 값 |
| 제품 명칭 | 정식 제품명과 상표. `CUBRID Admin`, `CUBRID Migration Toolkit` |
| UI 라벨 | 제품 화면에 표시되는 버튼·탭·메뉴·필드 라벨의 인용 |

### UI 라벨 처리 원칙

제품 화면 문자열과 표준 표기가 어긋날 때의 처리입니다.

- UI 라벨 인용은 **화면에 표시된 원문 그대로** 두고 인라인 리터럴로 감쌉니다.
- 서술 문장은 **표준 표기**를 사용합니다.
- 처음 등장할 때 표준 표기 뒤에 UI 라벨을 괄호로 병기합니다.

```rst
칼럼 매핑을 설정합니다. 객체 매핑 화면에서 ``Column``\ 을 선택하고,
매핑할 대상 칼럼을 지정합니다.
```

UI 라벨을 표준 표기로 바꾸면 **문서와 화면이 어긋나 고객이 기능을 찾지 못합니다.**

---

## 7. reStructuredText 작성 규칙

| 항목 | 규칙 |
|:---|:---|
| 제목 밑줄 | 제목 텍스트 길이 이상. 한글은 2바이트 폭으로 계산 |
| 제목 계층 | 파일 전체에서 일관된 문자 사용 |
| 지시자 본문 | 3칸 들여쓰기 |
| 표 | 셀 내용을 수정하면 구분선 길이를 함께 조정 |
| 상호 참조 | `:ref:` 타깃은 실제 존재하는 라벨 |
| 이미지 | `.. image::` / `.. figure::` 경로는 실제 파일을 가리킴 |
| `toctree` | 항목은 실제 존재하는 문서 |

### 문체

이 저장소의 기준 문체는 **`~한다`체(평서체)** 입니다.

| 디렉터리 | 한다체 | 합니다체 |
|:---|:---:|:---:|
| `ca-manual` | 513 | 5 |
| `cmt-manual` | 726 | 2 |

새로 추가·수정하는 문장은 `~한다`, `~된다`, `~있다`로 종결합니다.
표·그림 캡션, 목록 항목의 명사형 종결, 오류 메시지 원문 인용은 예외입니다.

> 이 문서(`STYLE_GUIDE.ko.md`)는 매뉴얼 본문이 아니므로 경어체를 사용합니다.

### 제품 명칭

| 제품 | 본문 표기 | 약어 | 현재 본문 |
|:---|:---|:---|:---:|
| CUBRID Admin | `CUBRID Admin` | `CA` | 127건 |
| CUBRID Migration Toolkit | `CUBRID Migration Toolkit` | `CMT` | 8건 / CMT 76건 |


`마이그레이션 툴킷`(현재 2건)은 제품 정식 명칭이 아니므로 `CUBRID Migration Toolkit`으로 수정합니다.
공통 규칙 18번 `툴킷 → 도구 모음`을 제품 명칭에 적용하지 않습니다.

### 이미지 파일명 변경 시

파일명을 바꾸면 이를 참조하는 **모든** 지시자를 함께 갱신합니다.
누락하면 Sphinx 빌드 경고와 깨진 이미지가 발생합니다.

```bash
# 저장소 루트에서 참조 누락 확인
grep -rn "변경한파일명" --include='*.rst' .
```

---

## 8. 고객 리스크 표현

매뉴얼은 고객사에 전달되는 문서입니다. 보증성 문구는 법적 리스크가 됩니다.

### 사용 금지

| 유형 | 금지 표현 |
|:---|:---|
| 보증성 | `완벽한`, `완벽하게`, `무결한`, `100% 보장`, `절대`, `손실 없이`, `모든 경우에` |
| 비교 우위 단정 | 경쟁 제품과의 우열을 조건 없이 단정하는 표현 |
| 조건 없는 성능 수치 | 하드웨어·데이터량·버전 조건 없이 제시하는 처리량·응답 시간 |

### 대안 문구

| 금지 | 대안 |
|:---|:---|
| 완벽한 이관이 가능합니다 | 검증된 데이터 타입 범위 내에서 이관합니다 |
| 손실 없이 복구합니다 | 백업 시점까지 복구합니다 |
| 100% 호환됩니다 | 지원 타입 매핑 표에 정의된 범위에서 호환됩니다 |
| 절대 실패하지 않습니다 | 사전 조건을 충족하면 정상 동작합니다 |
| 모든 DBMS를 지원합니다 | 지원 대상 DBMS 목록을 참조하십시오 |

---

## 9. 작성자 셀프 체크 절차

PR을 올리기 전에 다음 순서로 확인합니다.

### 1단계 — AUTO 항목 검색

```bash
# 한국어 AUTO 항목 (저장소 루트에서 실행)
grep -rn -E "에러|컬럼|매개 ?변수|파라메터|서브 ?쿼리|하위 질의|느린 (질의|쿼리)|슬로우쿼리|리턴|커멘트|쓰레드|메소드|디렉토리|메세지|데이타|스토리지|디폴트|커넥션|캐쉬|어플리케이션|셧다운|엔클러저|운영체제|소스코드|데이터 베이스" \
  --include='*.rst' ca-manual cmt-manual

# 영문 AUTO 항목
grep -rn -E "host name|user name|file name|time zone|fail-over|sub-query|upper[ -]case|white space|multi-byte|look-up|run-time|start-up|log-in|type-cast|data base|meta-data|on-line|back-up|can not|datatype" \
  --include='*.rst' ca-manual cmt-manual

# 영문 축약형 (4-1절) — 소유격 's 는 걸리지 않도록 어미를 지정
grep -rnE "\b(can|won|don|doesn|didn|isn|aren|wasn|weren|hasn|haven|hadn|shouldn|wouldn|couldn|mustn|shan)'t\b|\b(it|that|there|let)'s\b|\b(you|they|we)'re\b" \
  --include='*.rst' ca-manual cmt-manual
```

> 축약형 검색식은 `'t`, `'s`, `'re` 앞 단어를 명시해 소유격(`user's`, `Oracle's`)이 걸리지 않게 했습니다.
> `develop` 기준 검출 0건이므로 결과가 나오면 이번 PR에서 새로 들어온 것입니다.

검색 결과가 나오면 6절의 **제외 대상인지 먼저 판정**한 뒤 수정합니다.

> `develop` 브랜치 기준 한국어 AUTO 항목은 119건 검출됩니다(영문은 0건).
> 이 중 상당수는 UI 라벨이므로 **검출 건수와 수정 건수는 다릅니다.**
> 자신이 변경한 줄만 책임 범위입니다. 기존 오류의 전수 수정은 별도 표준화 작업으로 처리합니다.

### 1-1단계 — UI 라벨 오검출 걸러내기

두 매뉴얼 모두 GUI 도구를 다루므로 화면 문자열 인용이 많습니다. 이를 먼저 분리합니다.

```bash
# UI 라벨 위치(rubric 메뉴 경로 / 큰따옴표 라벨)
grep -rn --include='*.rst' -E '(rubric::|")[^"]*(매개 ?변수|컬럼|디렉토리)' ca-manual cmt-manual
```

여기 걸린 항목은 **원문을 유지**합니다.

```rst
.. rubric:: "호스트 이름 (마우스 우클릭) > 속성 > 매개 변수 구성"   ← 유지
해당 브로커의 SQL_LOG 매개 변수 값이 ON이면                        ← 파라미터로 수정
```

판정이 애매하면 UI 라벨로 간주해 원문을 유지합니다.
잘못 바꾸는 손해가 안 바꾸는 손해보다 큽니다.

### 2단계 — MANUAL 항목 확인

```bash
grep -rn -E "쿼리|리소스|유저|레퍼런스|툴킷|리스트" --include='*.rst' ca-manual cmt-manual
grep -rn -E "UTF-?8|utf-?8|EUC-?KR|euc-?kr|eucKR|Cubrid|centre|indices" --include='*.rst' ca-manual cmt-manual
```

각 건마다 문맥을 판정합니다. 유지하기로 결정했다면 PR 코멘트에 이유를 남깁니다.

### 3단계 — 빌드 검증

```bash
source venv/bin/activate
make ca-manual    # 또는 make cmt-manual
```

**경고가 0건이어야 합니다.** 제목 밑줄 길이, 깨진 참조, 누락된 이미지가 여기서 잡힙니다.

### 4단계 — 변경 범위 확인

```bash
git diff --stat develop...HEAD
```

표기 수정 PR에 기능 설명 변경을 섞지 않습니다. **PR 하나에 목적 하나**입니다.

### 5단계 — PR 본문 작성

표기 수정이 포함된 PR은 다음 형식으로 정리합니다.

```markdown
| 번호 | 오류 표기 | 수정 표기 | 모드 | 건수 |
|:---:|:---:|:---:|:---:|:---:|
| 12 | 디렉토리 | 디렉터리 | AUTO | 77 |
```

MANUAL 항목을 유지했다면 유지 이유를 함께 적습니다.

---

## 10. Greptile 자동 리뷰 연동

이 저장소에는 Greptile 리뷰 봇이 연결되어 있습니다.
PR을 올리면 이 표준을 근거로 자동 리뷰 코멘트가 달립니다.

### 설정 파일 위치

```
.greptile/
├── config.json                  공통 설정 + 공통 표기 규칙
├── rules.md                     공통 표기 기준
└── files.json                   이 문서를 리뷰 근거로 참조
ca-manual/.greptile/
├── config.json                  CA 전용 규칙 + 제외 대상
└── rules.md                     CA 전용 기준
cmt-manual/.greptile/
├── config.json                  CMT 전용 규칙 + 제외 대상
└── rules.md                     CMT 전용 기준
```

상위 디렉터리 규칙과 하위 디렉터리 규칙은 **덮어쓰지 않고 합쳐집니다.**
`ca-manual/`의 파일을 리뷰할 때는 루트 규칙 + `ca-manual` 규칙이 모두 적용됩니다.

### 코멘트 형식

코멘트는 두 유형으로 나뉩니다. **제목으로 대응 방법이 결정됩니다.**

```
[표기 표준 위반]
ASIS: 디렉토리를 생성합니다.
TOBE: 디렉터리를 생성합니다.
근거: ko-notation-auto (표준 12번)
→ 수정합니다.
```

```
[문맥 확인 필요]
ASIS: 유저 권한을 확인한다.
TOBE: 사용자 권한을 확인한다.
근거: ko-notation-manual (표준 14번)
예외: DB 계정명, 옵션명 user/username은 유지
→ 문맥을 판정해 판단합니다. 유지한다면 이유를 답글로 남깁니다.
```

`AUTO` 항목과 `MANUAL` 항목이 **한 코멘트에 섞여 있으면 설정 오류**입니다.
그 상태로는 어떤 항목이 강제이고 어떤 항목이 판단 대상인지 알 수 없으므로 답글로 알려 주십시오.

### 봇 지적이 틀렸을 때

제외 대상(6절)을 잘못 지적했다면 **그냥 무시하지 말고** 이유를 답글로 남깁니다.

```
@greptileai 이 부분은 cubrid.conf 파라미터명이라 원문을 유지해야 합니다.
```

봇이 같은 오탐을 반복하면 해당 디렉터리의 `.greptile/config.json`
`instructions`에 제외 조건을 추가하거나, `disabledRules`에 규칙 ID를 넣습니다.

### 재리뷰

PR에 커밋을 추가하면 자동으로 재리뷰됩니다(`triggerOnUpdates: true`).
수동으로 다시 돌리려면 PR에 `@greptileai` 를 코멘트하거나
리뷰 코멘트 하단의 `Re-trigger Greptile` 링크를 사용합니다.

### 한계

Greptile은 **PR에서 변경된 부분**을 검토합니다.
기존 문서에 이미 들어 있는 오류는 지적되지 않습니다.
전수 수정은 별도 표준화 작업(CUBRIDMAN-343 같은)으로 처리합니다.

또한 LLM 기반이므로 판정이 100% 일정하지 않습니다.
**AUTO 항목의 최종 책임은 작성자에게 있습니다.** 9절 셀프 체크를 생략하지 마십시오.

검증 결과(PR #16) 실제로 다음 한계가 확인되었습니다.

- 한 규칙에 20개 이상의 치환 항목을 나열하면 **뒤쪽 항목이 누락**될 수 있습니다.
  축약형을 별도 규칙(`en-contraction-guard`)으로 분리한 이유입니다.
- `severity` 값은 배지 등급으로 전달되지 않습니다. 코멘트 제목으로 구분합니다.
- 여러 항목을 묶어 지적할 때 그 범위 안의 일부 항목이 빠질 수 있습니다.

따라서 9절의 `grep` 검색은 봇 리뷰로 대체할 수 없습니다.

---

## 11. 표준 변경 절차

표기 기준을 바꾸거나 예외를 추가할 때의 절차입니다.

1. Jira에 이슈를 등록하고 변경 근거를 남깁니다(국립국어원 기준, 제품 UI 변경, 상표 정책 등).
2. 이 문서(`docs/STYLE_GUIDE.ko.md`)를 먼저 수정합니다.
3. `.greptile/rules.md`와 관련 `config.json`의 규칙 문장을 동일하게 반영합니다.
4. 기존 문서의 전수 수정이 필요한지 판단하고, 필요하면 별도 PR로 분리합니다.
5. 하나의 PR에서 3~4를 함께 처리하지 않습니다.

### 규칙 ID 목록

`disabledRules`로 예외 처리할 때 사용하는 ID입니다.

| 위치 | 규칙 ID | 심각도 |
|:---|:---|:---:|
| 루트 | `ko-notation-auto` | high |
| 루트 | `ko-notation-manual` | low |
| 루트 | `en-notation-auto` | high |
| 루트 | `en-notation-word` | high |
| 루트 | `en-contraction-guard` | high |
| 루트 | `en-notation-manual` | low |
| 루트 | `encoding-notation-context` | medium |
| 루트 | `ko-honorific-consistency` | low |
| 루트 | `ui-label-verbatim` | medium |
| ca-manual | `ca-product-name` | high |
| ca-manual | `ca-ui-menu-path` | high |
| ca-manual | `ca-config-literal-guard` | medium |
| ca-manual | `ca-procedure-safety` | medium |
| cmt-manual | `cmt-product-name` | high |
| cmt-manual | `cmt-ui-label-quoting` | medium |
| cmt-manual | `cmt-typemap-literal-guard` | medium |
| cmt-manual | `cmt-image-step-sync` | medium |

특정 디렉터리에서만 규칙을 끄려면 그 디렉터리의 `.greptile/config.json`에 다음을 추가합니다.

```json
{
  "disabledRules": ["en-notation-word"]
}
```
