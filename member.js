function skillsMember() {
  const skills = require('./skills')
  const { getMember } = require('./member')

  return async function (req, res, next) {
    const member = await getMember(req)

    if (!member) {
      return next()
    }

    const { skill } = req.params

    if (!skill) {
      return next()
    }

    if (skill === 'all') {
      res.locals.skills = await skills.getSkillsForMember(member.id)
      return next()
    }

    const skillData = await skills.getSkill(skill)

    if (!skillData) {
      return next()
    }

    res.locals.skill = skillData

    const memberSkill = await skills.getSkillForMember(member.id, skillData.id)

    if (memberSkill) {
      res.locals.memberSkill = memberSkill
      res.locals.memberSkillProgress = Math.round((memberSkill.progress / skillData.maxPoints) * 100)
      res.locals.memberSkillProgressBarWidth = Math.min(100, res.locals.memberSkillProgress)
      res.locals.memberSkillPointsNeeded = Math.max(0, skillData.maxPoints - memberSkill.progress)
      res.locals.memberHasPassedSkill = memberSkill.pass
    }

    next()
  }
}