# CUBRID 도구 매뉴얼 표기 규칙 (Greptile 리뷰 기준)

이 문서는 `CUBRID/tool-manuals` 저장소 전체에 적용되는 표기 표준입니다.
근거: [CUBRIDMAN-343](http://jira.cubrid.org/browse/CUBRIDMAN-343) 매뉴얼 표준화 작업

사람이 읽는 정본은 `docs/STYLE_GUIDE.ko.md`이며, 이 파일은 동일한 기준을 Greptile 리뷰용으로 정리한 것입니다.
두 문서의 내용이 어긋나면 `docs/STYLE_GUIDE.ko.md`를 우선합니다.

---

## 0. 모드 구분

| 모드 | 의미 | 심각도 | 리뷰 동작 |
|:---|:---|:---:|:---|
| `AUTO` | 문맥과 무관하게 항상 틀린 표기 | `high` | 수정 요구 |
| `WORD` | 단어 경계 기준으로 판단해야 하는 표기 | `high` | 단어 경계 확인 후 수정 요구 |
| `MANUAL` | 문맥에 따라 유지될 수 있는 표기 | `low` | 확인 요청(강제 아님) |

`MANUAL` 항목은 **오류 단정 금지**입니다. 예외 조건을 함께 안내하고 작성자가 판단하도록 합니다.

### 코멘트 분리 원칙

`AUTO`·`WORD` 항목과 `MANUAL` 항목은 **반드시 별도 코멘트로 분리**합니다.

| 유형 | 코멘트 제목 | 작성자 대응 |
|:---|:---|:---|
| `AUTO`, `WORD` | `[표기 표준 위반]` | 수정 요구 |
| `MANUAL` | `[문맥 확인 필요]` | 예외 조건 확인 후 작성자 판단 |

한 줄에 두 유형이 함께 있어도 코멘트를 합치지 않습니다.
합치면 작성자가 문맥 판단이 필요한 항목까지 강제 수정으로 오해합니다.

> 심각도 값(`high`/`low`)은 Greptile 배지 등급(P1~P4)에 그대로 반영되지 않습니다.
> 따라서 두 유형의 구분은 **코멘트 제목과 본문 문구**로 드러내야 합니다.

---

## 1. 한국어 표기 규칙 (34개 항목)

| 번호 | 오류 표기 | 권장 표기 | 모드 | 비고 |
|:---:|:---|:---|:---:|:---|
| 1 | 에러 | 오류 | AUTO | |
| 2 | 컬럼 | 칼럼 | AUTO | 이미지 파일명·SQL 식별자는 제외 |
| 3 | 매개 변수 | 파라미터 | AUTO | |
| 4 | 서브 쿼리 | 부질의 | AUTO | |
| 5 | 슬로우쿼리 | 슬로우 쿼리 | AUTO | 원어 `slow query`가 두 단어이므로 띄어 씀 |
| 6 | 쿼리 | 질의 | MANUAL | **`슬로우 쿼리`·`부질의`는 유지**, 제품 UI 명칭·옵션명 유지. 1-1절 판정 순서 참조 |
| 7 | 리턴 | 반환 | AUTO | |
| 8 | 커멘트 | 주석 | AUTO | |
| 9 | 쓰레드 | 스레드 | AUTO | |
| 10 | 리소스 | 자원 | MANUAL | 옵션값·경로·API명의 resource는 유지 |
| 11 | 메소드 | 메서드 | AUTO | |
| 12 | 디렉토리 | 디렉터리 | AUTO | |
| 13 | 메세지 | 메시지 | AUTO | |
| 14 | 유저 | 사용자 | MANUAL | DB 계정명, 옵션명 `user`/`username`은 유지 |
| 15 | 파라메터 | 파라미터 | AUTO | |
| 16 | 레퍼런스 | 참조 | MANUAL | 공식 문서 제목(레퍼런스 매뉴얼)은 유지 |
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

### 규칙 간 충돌 처리

- 5·31·34번(→ `슬로우 쿼리`)이 6번(쿼리 → 질의)보다 **우선**합니다. `슬로우 쿼리`를 `슬로우 질의`로 바꾸지 않습니다.
- 4·29·30번(→ `부질의`)이 6번보다 **우선**합니다.
- `느린 쿼리`는 6번을 먼저 적용해 `느린 질의`로 바꾸지 않고, 34번으로 한 번에 `슬로우 쿼리`로 수정합니다.
- 18번(툴킷 → 도구 모음)은 제품 정식 명칭에 적용하지 않습니다.

---

## 1-1. `query` 번역 판정 순서

같은 `query`가 문서에서 `질의`·`부질의`·`쿼리` 세 가지로 나타납니다. 임의 선택이 아니며 다음 순서로 판정합니다.

| 순서 | 판정 기준 | 결과 | 예 |
|:---:|:---|:---|:---|
| 1 | 제품이 영문 식별자로 노출하는 **기능 명칭**인가 | 음차 유지 + 원어 띄어쓰기 | `슬로우 쿼리` |
| 2 | 순화어가 이미 **정착한 복합어**인가 | 순화어 사용 | `부질의` |
| 3 | 그 외 일반 명사 | 순화 | `질의` |

### 1번 기준의 근거

`슬로우 쿼리`는 다음 제품 식별자와 직접 연결됩니다.

| 위치 | 식별자 |
|:---|:---|
| `cubrid.conf` | `sql_trace_slow` |
| `cubrid_broker.conf` | `SLOW_LOG`, `LONG_QUERY_TIME` |
| JDBC / CCI 연결 URL | `logSlowQueries`, `slowQueryThresholdMillis` |

`슬로우 질의`로 바꾸면 독자가 위 파라미터를 문서에서 찾지 못합니다.
띄어 쓰는 이유는 원어 `slow query`가 두 단어이고, 한글 맞춤법 제2항이 단어별 띄어쓰기를 원칙으로 하기 때문입니다. `슬로우쿼리`는 사전 등재어가 아니므로 한 단어로 굳었다고 볼 수 없습니다.

첫 등장 시 `슬로우 쿼리(slow query)`로 원어를 병기합니다.

> **실측(develop 기준)**
> `ko` 매뉴얼: `슬로우 쿼리` 21건, `슬로우쿼리` 0건, `느린 질의` 1건
> `tool-manuals`: 네 표기 모두 0건 — 이 저장소에서는 예방 목적 규칙입니다.
> `부질의` 197건 대 `서브 쿼리`·`서브쿼리`·`하위 질의` 48건이므로 2번 기준은 근거가 충분합니다.

---

## 2. 영문 표기 규칙 (34개 항목)

| 번호 | 오류 표기 | 권장 표기 | 모드 | 비고 |
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
| 18 | datatype | data type | WORD | 코드·API 식별자의 `datatype`은 유지 |
| 19 | data base | database | AUTO | |
| 20 | meta-data | metadata | AUTO | |
| 21 | on-line | online | AUTO | |
| 22 | back-up | backup | AUTO | |
| 23 | can not | cannot | WORD | |
| 24 | can't 등 축약형 | cannot 등 원형 | AUTO | 전용 규칙 `en-contraction-guard`, 2-1절 참조 |
| 25 | centre | center | MANUAL | 예제 데이터 값은 제외 |
| 26 | indices | indexes | WORD | 수학적 지수 문맥은 `indices` 유지 |
| 27 | Cubrid | CUBRID | MANUAL | 클래스명(`SpCubrid`)·SQL 예제 제외 |
| 28 | Id | ID | MANUAL | 코드 식별자·필드명의 `Id`는 유지 |
| 29 | UTF8 | UTF-8 | MANUAL | 3절 참조 |
| 30 | utf-8 | UTF-8 | MANUAL | 3절 참조 |
| 31 | euckr | EUC-KR | MANUAL | 3절 참조 |
| 32 | eucKR | euckr | MANUAL | 3절 참조 |
| 33 | EUCKR | EUC-KR | MANUAL | 3절 참조 |
| 34 | UTF-8 | utf8 | MANUAL | **옵션값 예제에서만** 적용, 3절 참조 |

---

## 2-1. 영문 축약형 (규칙 `en-contraction-guard`)

영문 서술 문장에 축약형을 사용하지 않습니다. 전용 규칙으로 분리되어 있으며 **한 건만 있어도 지적**합니다.

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

### 소유격은 대상이 아닙니다

아포스트로피가 있어도 소유격은 축약형이 아닙니다. **절대 지적하지 않습니다.**

```
user's password        (O) 소유격 — 유지
Oracle's data type     (O) 소유격 — 유지
the database's owner   (O) 소유격 — 유지
it's not supported     (X) it is not supported 로 수정
```

### 그 밖의 제외 대상

- 코드 블록 내부와 인라인 리터럴
- 제품이 출력하는 메시지·로그 원문
- 예제 데이터 값
- 외부 문서·표준 문서에서 그대로 인용한 문장

> `develop` 기준 현재 본문의 축약형은 **0건**입니다. 이 규칙은 유입 방지 목적입니다.

---

## 3. 문자 인코딩 표기 기준

29~34번은 **서로 반대 방향의 규칙**을 포함합니다. 기계적 치환은 금지하며, 문자열의 위치를 먼저 판정해야 합니다.

### 판정 순서

1. 해당 문자열이 **명령어·옵션값·설정 파일 예제** 안에 있는가?
   - 예 → **소문자, 하이픈 없음**: `utf8`, `euckr`, `ko_KR.euckr`, `ko_KR.utf8`
   - CUBRID는 대소문자를 구분하지 않지만, 문서 표기는 소문자 하나로 통일합니다.
2. 해당 문자열이 **일반 설명 문장** 안에 있는가?
   - 예 → **IANA 표준 명칭**: `UTF-8`, `EUC-KR`
3. 옵션값 자리에 하이픈 표기(`UTF-8`, `EUC-KR`)를 사용하지 않습니다.

> **이 규칙은 6절 제외 대상의 유일한 예외입니다.**
> 옵션값 예제가 코드 블록이나 인라인 리터럴 안에 있어도 하이픈 표기라면 수정 대상입니다.
> 다른 표기 규칙은 코드 블록 안에서 적용하지 않습니다.

### 적용 예

| 위치 | 잘못된 예 | 올바른 예 |
|:---|:---|:---|
| 설명 문장 | 데이터베이스 문자셋을 UTF8로 지정합니다. | 데이터베이스 문자셋을 UTF-8로 지정합니다. |
| 설명 문장 | euckr 인코딩을 지원합니다. | EUC-KR 인코딩을 지원합니다. |
| 옵션값 예제 | `cubrid createdb --db-locale=ko_KR.eucKR` | `cubrid createdb --db-locale=ko_KR.euckr` |
| 옵션값 예제 | `charset=UTF-8` | `charset=utf8` |

---

## 4. reStructuredText 작성 규칙

표기 규칙과 함께 다음 항목도 검토 대상입니다.

- 제목 밑줄/윗줄 문자 길이는 제목 텍스트 길이 이상이어야 합니다. 한글은 2바이트 폭으로 계산합니다.
- 제목 계층 문자는 파일 전체에서 일관되게 사용합니다.
- 지시자(`.. note::`, `.. code-block::` 등) 본문은 3칸 들여쓰기합니다.
- 표를 수정할 때 구분선 길이를 함께 맞춥니다.
- `:ref:` 타깃은 실제 존재하는 라벨이어야 합니다.
- `.. image::` / `.. figure::` 경로는 실제 파일을 가리켜야 합니다.
- 코드 블록 안의 명령어·출력·예제 데이터는 **표기 규칙 적용 대상이 아닙니다.** 원문을 그대로 유지합니다.

### 문체

이 저장소의 기준 문체는 **`~한다`체(평서체)** 입니다.

| 디렉터리 | 한다체 | 합니다체 |
|:---|:---:|:---:|
| `ca-manual` | 513 | 5 |
| `cmt-manual` | 726 | 2 |

새로 추가·수정하는 문장은 `~한다`, `~된다`, `~있다`로 종결합니다.
표·그림 캡션, 목록 항목의 명사형 종결, 오류 메시지 원문 인용은 예외입니다.

---

## 5. 고객 리스크 표현

다음 표현은 근거 없이 사용되면 지적합니다. 매뉴얼은 고객사에 전달되는 문서이므로 보증성 문구는 법적 리스크가 됩니다.

- `완벽한`, `완벽하게`, `무결한`, `100% 보장`, `절대`, `손실 없이`, `모든 경우에`
- 경쟁 제품과의 우열을 단정하는 표현
- 성능 수치를 조건(하드웨어, 데이터량, 버전) 없이 제시하는 표현

권장 대안: `대부분의 경우`, `~ 조건에서`, `검증된 범위 내에서`, `지원합니다`

---

## 6. 지적하지 말아야 할 것

Greptile은 다음 위치에서 표기 규칙 위반을 지적하지 않습니다.

- 코드 블록: `.. code-block::`, `.. literalinclude::`, `::` 리터럴 블록
- 인라인 리터럴(이중 백틱)
- 명령어, 옵션명, 옵션값, 시스템 파라미터명, 환경 변수명
- SQL 예약어, 식별자, 예제 데이터
- 제품 출력 오류 메시지·로그 원문
- 파일명, 디렉터리 경로, URL, 이미지 경로
- Sphinx 지시자·역할 문법과 그 타깃 값
- 제품 정식 명칭 및 상표
- **UI 라벨 인용**: `.. rubric::` 메뉴 경로, 큰따옴표로 감싼 화면 메뉴·버튼·탭·필드 라벨
- 이 PR에서 변경되지 않은 줄(기존 오류의 일괄 수정은 별도 표준화 작업으로 처리)

### UI 라벨 판정

두 매뉴얼 모두 GUI 도구를 다루므로 화면 문자열 인용이 많습니다.

```rst
.. rubric:: "호스트 이름 (마우스 우클릭) > 속성 > 매개 변수 구성"
```

`매개 변수 구성`은 화면 메뉴명입니다. 규칙 3번을 적용하면 사용자가 메뉴를 찾지 못합니다.
**판정이 애매하면 UI 라벨로 간주해 원문을 유지합니다.**
