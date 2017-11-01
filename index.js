/*
	version 1.0
	Update : 2017-08-11
	Update : 2017-10-20 -> S_QUEST_BALLOON 적용
		
*/
const BossIds = {
	zone: [935, 935, 935], //zone
	id: [1000, 2000, 3000], //id
};

let currentBoss = null;

let isReverse;
let firstSkill;
let lastSkill;

module.exports = function RouletteAssist(dispatch) {
	let enabled = true;
	let boss = false;

	//보스를 만나다
	dispatch.hook('C_MEET_BOSS_INFO', 1, event => {
		if (!enabled) return;
		if (
			BossIds.zone.includes(event.huntingZoneId) &&
			BossIds.id.includes(event.templateId)
		) {
			isReverse = false;
		}
	});

	// 보스정보
	dispatch.hook('S_BOSS_GAGE_INFO', 3, event => {
		if (!enabled) return;
		if (
			BossIds.zone.includes(event.huntingZoneId) &&
			BossIds.id.includes(event.templateId)
		) {
			boss = event;
		}
	});

	// 1넴
	dispatch.hook('S_ACTION_STAGE', 1, event => {
		if (!enabled || !boss) return;
		if (boss.id - event.source == 0) {
			if (boss.templateId == BossIds.id[0]) firstBoss(event);
		}
	});

	// 3넴 문제
	dispatch.hook('S_QUEST_BALLOON', 1, event => {
		if (!enabled || !boss) return;
		const msgId = parseInt(event.message.replace('@monsterBehavior:', ''));

		switch (msgId) {
			case 935301: //근
				lastSkill = '근';
				break;
			case 935302: //원
				lastSkill = '원';
				break;
			case 935303: //터
				lastSkill = '터';
				break;
			default:
				return;
		}
		// 역방향
		if (isReverse) sendSysMsg(`${lastSkill} ${firstSkill}`);
		else sendSysMsg(`${firstSkill} ${lastSkill}`);
		// swap
		firstSkill = lastSkill;
	});

	// 3넴 이벤트
	dispatch.hook('S_DUNGEON_EVENT_MESSAGE', 1, event => {
		if (!enabled || !boss) return;
		const msgId = parseInt(event.message.replace('@dungeon:', ''));

		switch (msgId) {
			case 9935311: //정방향
				isReverse = false;
				break;
			case 9935312: //역방향
				isReverse = true;
				break;
			case 9935302: //초기값 : 근
				firstSkill = '근';
				break;
			case 9935303: //초기값 : 원
				firstSkill = '원';
				break;
			case 9935304: //초기값 : 터
				firstSkill = '터';
				break;
			default:
				return;
		}
		//역방향이면
		if (isReverse) sendSysMsg(`_ ${firstSkill}`);
		else sendSysMsg(`${firstSkill} _`);
	});

	function firstBoss(event) {
		// 1넴 피자 어시스트
		const skillNum = event.skill;
		let msg;

		switch (skillNum) {
			case 1202129163:
			case 1202128163:
			case 1202129167:
			case 1202128167:
				msg = '[1]';
				break;
			case 1202129159:
			case 1202128159:
			case 1202129171:
			case 1202128171:
				msg = '[2]';
				break;
			case 1202129160:
			case 1202128160:
			case 1202129172:
			case 1202128172:
				msg = '[3]';
				break;
			case 1202129164:
			case 1202128164:
			case 1202129168:
			case 1202128168:
				msg = '[4]';
				break;
			case 1202129161:
			case 1202128161:
			case 1202129169:
			case 1202128169:
				msg = '[5]';
				break;
			case 1202129165:
			case 1202128165:
			case 1202129173:
			case 1202128173:
				msg = '[6]';
				break;
			case 1202129166:
			case 1202128166:
			case 1202129170:
			case 1202128170:
				msg = '[7]';
				break;
			case 1202129162:
			case 1202128162:
			case 1202129174:
			case 1202128174:
				msg = '[8]';
				break;
			default:
				return;
		}
		sendSysMsg(msg);
	}

	function sendSysMsg(msg) {
		dispatch.toClient('S_CHAT', 1, {
			channel: 24,
			authorName: '',
			message: '   ' + msg,
		});
	}
};
