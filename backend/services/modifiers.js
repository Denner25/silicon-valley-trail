const MODIFIERS = {
  fast_developer: {
    event: "Bug Fix Marathon",
    apply: (result, member) => {
      result.cash += 50;
      result.notes.push(
        `${member.name}'s fast development improved productivity (+50 cash).`,
      );
    },
  },

  organized: {
    event: "Unexpected Server Crash",
    apply: (result, member) => {
      result.cash += 20;
      result.morale += 5;
      result.notes.push(
        `${member.name}'s organization reduced the impact (+20 cash, +5 morale).`,
      );
    },
  },

  lactose_intolerant: {
    event: ["Coffee Run", "Hackathon", "coffeeStop"],
    apply: (result, member) => {
      if (Math.random() < 0.9) {
        result.morale -= 5;
        result.notes.push(
          `${member.name} is lactose intolerant and the coffee caused stress (-5 morale).`,
        );
      }
    },
  },

  anxiety: {
    event: "Bug Fix Marathon",
    apply: (result, member) => {
      result.morale -= 10;
      result.notes.push(
        `${member.name}'s anxiety increased stress (-10 morale).`,
      );
    },
  },

  creative_coder: {
    event: "VC Pitch Success",
    apply: (result, member) => {
      result.cash += 100;
      result.morale += 5;
      result.notes.push(
        `${member.name}'s creativity impressed investors (+100 cash, +5 morale).`,
      );
    },
  },

  procrastination: {
    event: "Hackathon",
    apply: (result, member) => {
      result.morale -= 5;
      result.notes.push(
        `${member.name}'s procrastination caused delays (-5 morale).`,
      );
    },
  },
};

function applyModifiers(team, eventName, result) {
  team.forEach((member) => {
    const traits = [...member.strengths, ...member.weaknesses];

    traits.forEach((trait) => {
      const modifier = MODIFIERS[trait];

      if (
        modifier &&
        ((Array.isArray(modifier.event) &&
          modifier.event.includes(eventName)) ||
          modifier.event === eventName)
      ) {
        modifier.apply(result, member);
      }
    });
  });
}

module.exports = { applyModifiers };
