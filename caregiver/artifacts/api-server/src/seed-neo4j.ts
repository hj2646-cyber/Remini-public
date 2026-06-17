import * as dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

import { runQuery, getNeo4jDriver } from "./neo4j";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

async function seed() {
  console.log("🌱 Neo4j 시드 데이터 삽입 시작...");

  try {
    // 1. 기존 데이터 삭제
    await runQuery("MATCH (n) DETACH DELETE n");
    console.log("✅ 기존 데이터 삭제 완료");

    const now = new Date().toISOString();

    // 2. 보호자(Caregiver) 생성
    const cg1Id = randomUUID();
    const cg2Id = randomUUID();
    const adminId = randomUUID();
    const cg1Password = await bcrypt.hash("password123", SALT_ROUNDS);
    const cg2Password = await bcrypt.hash("password456", SALT_ROUNDS);
    const adminPassword = await bcrypt.hash("admin1234", SALT_ROUNDS);

    await runQuery(
      `CREATE (cg1:Caregiver {
        id: $cg1Id, email: "miyoung@example.com", password: $cg1Password,
        name: "김미영", role: "caregiver", createdAt: $now, updatedAt: $now
      }),
      (cg2:Caregiver {
        id: $cg2Id, email: "jungho@example.com", password: $cg2Password,
        name: "이정호", role: "caregiver", createdAt: $now, updatedAt: $now
      }),
      (admin:Caregiver {
        id: $adminId, email: "admin@remini.local", password: $adminPassword,
        name: "관리자", role: "admin", createdAt: $now, updatedAt: $now
      })`,
      { cg1Id, cg2Id, adminId, cg1Password, cg2Password, adminPassword, now }
    );
    console.log("✅ 보호자 등록 완료");

    // 3. 환자 생성 및 보호자-환자 관계
    const p1Id = randomUUID();
    const p2Id = randomUUID();

    await runQuery(
      `MATCH (cg1:Caregiver {id: $cg1Id}), (cg2:Caregiver {id: $cg2Id})
       CREATE (p1:Patient {
        id: $p1Id, name: "김복순", birthYear: 1942, diagnosis: "알츠하이머형 치매",
        caregiverName: "김미영", status: "stable", createdAt: $now, updatedAt: $now
      }),
      (p2:Patient {
        id: $p2Id, name: "이상철", birthYear: 1938, diagnosis: "혈관성 치매",
        caregiverName: "이정호", status: "attention", createdAt: $now, updatedAt: $now
      })
      CREATE (cg1)-[:CARES_FOR]->(p1)
      CREATE (cg2)-[:CARES_FOR]->(p2)`,
      { cg1Id, cg2Id, p1Id, p2Id, now }
    );
    console.log("✅ 환자 등록 및 보호자 연결 완료");

    // 4. 김복순 대화 & 메시지 & 피드백
    const conv1Id = randomUUID();
    await runQuery(
      `MATCH (p:Patient {id: $p1Id})
       CREATE (c:Conversation {
         id: $conv1Id, sessionDate: $date, summary: $summary,
         feedbackSubmitted: true, messageCount: 6, createdAt: $now
       })
       CREATE (p)-[:HAS_CONVERSATION]->(c)
       CREATE (m1:Message {id: "m1", role: "assistant", content: "안녕하세요, 복순 할머니! 오늘 날씨가 참 좋네요. 어릴 때 가장 좋아하셨던 계절이 어떤 계절이었나요?", timestamp: $t1}),
              (m2:Message {id: "m2", role: "patient", content: "봄이 제일 좋았지. 봄에는 앞동산에 진달래가 피어서 참 예뻤어. 우리 마을 뒷산에도 진달래가 많았는데...", timestamp: $t2}),
              (m3:Message {id: "m3", role: "assistant", content: "진달래꽃 말씀이군요! 고향 마을이 어디셨어요? 산이 많았나요?", timestamp: $t3}),
              (m4:Message {id: "m4", role: "patient", content: "경상북도 안동이야. 강이 흐르는 마을이었는데, 어릴 때 오빠들이랑 강가에서 물고기 잡고 놀았지. 그때가 참 좋았어.", timestamp: $t4}),
              (m5:Message {id: "m5", role: "assistant", content: "안동에서 오빠들이랑 강가에서 물고기를 잡으셨군요! 어떤 물고기를 잡으셨어요?", timestamp: $t5}),
              (m6:Message {id: "m6", role: "patient", content: "피라미, 붕어... 가재도 잡고. 어머니가 매운탕 끓여주시면 얼마나 맛있었는지 몰라. 지금도 그 맛이 생각나네.", timestamp: $t6})
       CREATE (c)-[:HAS_MESSAGE]->(m1), (c)-[:HAS_MESSAGE]->(m2), (c)-[:HAS_MESSAGE]->(m3),
              (c)-[:HAS_MESSAGE]->(m4), (c)-[:HAS_MESSAGE]->(m5), (c)-[:HAS_MESSAGE]->(m6)
       CREATE (f:Feedback {
         id: $f1Id, satisfaction: "satisfied", topicRelevance: 5, toneAppropriate: 5,
         memoryAccuracy: 4, comments: "어린 시절 이야기를 잘 이끌어내 주었습니다. 할머니께서 매우 즐거워하셨어요.", createdAt: $now
       })
       CREATE (c)-[:HAS_FEEDBACK]->(f)`,
      {
        p1Id, conv1Id, f1Id: randomUUID(), now,
        date: new Date("2026-03-15T10:30:00").toISOString(),
        summary: "어린 시절 고향 마을과 강가에서 물고기 잡던 추억을 생생하게 기억하셨습니다.",
        t1: new Date("2026-03-15T10:31:00").toISOString(),
        t2: new Date("2026-03-15T10:31:45").toISOString(),
        t3: new Date("2026-03-15T10:32:20").toISOString(),
        t4: new Date("2026-03-15T10:33:10").toISOString(),
        t5: new Date("2026-03-15T10:33:55").toISOString(),
        t6: new Date("2026-03-15T10:34:40").toISOString(),
      }
    );

    // 5. 김복순 지식
    await runQuery(
      `MATCH (p:Patient {id: $p1Id})
       CREATE (k1:KnowledgeItem {id: $k1, type: "life_memory", category: "고향 / 유년기", title: "경북 안동 출신", content: "경상북도 안동시 출신. 강가에서 오빠들과 물고기 잡던 추억.", importance: 3, createdAt: $now}),
              (k2:KnowledgeItem {id: $k2, type: "life_memory", category: "가족", title: "결혼 및 자녀", content: "22세 결혼, 슬하 3남 1녀. 큰아들 서울 거주.", importance: 3, createdAt: $now})
       CREATE (p)-[:HAS_KNOWLEDGE]->(k1), (p)-[:HAS_KNOWLEDGE]->(k2)`,
      { p1Id, k1: randomUUID(), k2: randomUUID(), now }
    );

    // 6. 알림
    await runQuery(
      `MATCH (p1:Patient {id: $p1Id}), (p2:Patient {id: $p2Id})
       CREATE (a1:Alert {id: $a1, level: "info", message: "오늘 오전 대화 세션 정상 완료", isRead: true, createdAt: $now}),
              (a2:Alert {id: $a2, level: "emergency", message: "이상철 환자 혈압 주의!", isRead: false, createdAt: $now})
       CREATE (p1)-[:HAS_ALERT]->(a1), (p2)-[:HAS_ALERT]->(a2)`,
      { p1Id, p2Id, a1: randomUUID(), a2: randomUUID(), now }
    );

    console.log("✅ 시드 완료!");
    console.log("");
    console.log("📋 샘플 보호자 계정:");
    console.log("  - 김미영: miyoung@example.com / password123");
    console.log("  - 이정호: jungho@example.com / password456");
    console.log("  - 관리자: admin@remini.local / admin1234");
    process.exit(0);
  } catch (err) {
    console.error("❌ 시드 에러:", err);
    process.exit(1);
  } finally {
    const d = getNeo4jDriver();
    await d.close();
  }
}

seed();
