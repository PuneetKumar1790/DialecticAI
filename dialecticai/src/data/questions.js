export const QUESTION_BANK = {

  existential: [
    "I don't even know if the life I'm chasing is something I actually want.",
    "I wake up every day performing a version of myself I don't recognize.",
    "What if I'm not lost — what if I just hate where I'm going?",
    "I've achieved everything I planned. Why does it feel like nothing?",
    "I keep waiting for my real life to start. What if this is it?",
    "I'm terrified that I'm ordinary and always will be.",
    "If no one was watching my life, would I be living it differently?",
    "I don't know if I believe in anything anymore.",
    "I feel like I'm living someone else's dream and I can't find the exit.",
    "What's the point of being successful if you're empty inside?"
  ],

  genz: [
    "Social media is making me hate myself but I can't stop scrolling.",
    "Everyone my age seems to be doing something meaningful. I'm just existing.",
    "I don't know if I want a relationship or if I've just been told I should.",
    "My anxiety is treated like a personality trait now. Is it?",
    "I'm exhausted by being perceived.",
    "I curate my life for people who don't actually care about me.",
    "Everyone is building a personal brand. I don't even have a personal self.",
    "I don't know if I'm depressed or if this is just what being alive feels like now.",
    "Is it okay to want a quiet, unambitious life? Or is that giving up?",
    "I romanticize the idea of disappearing and starting over somewhere no one knows me.",
    "I feel guilty for not being more grateful when so many have less.",
    "Dating apps have made me feel like a product. I hate it but I keep using them.",
    "I'm afraid to commit to anything because what if something better comes along?",
    "My parents sacrificed everything for me. I don't want what they wanted for me."
  ],

  career: [
    "I'm good at my job but I dread every single Monday.",
    "I took the safe job. Five years later I still resent myself for it.",
    "My boss takes credit for my work. I say nothing. Every time.",
    "I want to quit and start something but I'm terrified of failing publicly.",
    "I work 70 hour weeks and still feel like I'm not doing enough.",
    "Everyone around me is getting promoted. I'm just getting older.",
    "I chose money over passion ten years ago. Now I have neither.",
    "I'm underpaid and I know it. I still haven't asked for a raise.",
    "Should I work for a company I believe in that pays less, or the opposite?",
    "I've been in the same role for three years. Is loyalty stupid?"
  ],

  relationships: [
    "I love someone who is completely wrong for me and I know it.",
    "My closest friends are strangers to who I've become.",
    "I keep attracting the same kind of person. It has to be me.",
    "I've been alone for so long I'm not sure I know how to let someone in.",
    "I stayed in a relationship too long out of fear of being alone.",
    "I don't know if I actually love them or if I'm just comfortable.",
    "My family has expectations of me that are slowly crushing me.",
    "I'm loyal to people who would not do the same for me.",
    "I forgave someone I shouldn't have. Now I can't respect myself.",
    "I don't know how to love someone without losing myself."
  ],

  society: [
    "Democracy feels broken but I don't know what to replace it with.",
    "The news makes me furious but nothing I do seems to change anything.",
    "Is capitalism the problem or am I just bad at it?",
    "I benefit from systems I believe are unjust. What do I do with that?",
    "Technology was supposed to free us. Why do I feel more trapped?",
    "Meritocracy is a myth but I still believe in it. Am I stupid?",
    "Is it possible to be truly ethical in an unethical system?",
    "Everyone has strong opinions. No one changes their mind. What's the point?",
    "Is nationalism dangerous or is globalism naive?",
    "Social media has destroyed nuance. Can it be saved?"
  ],

  money: [
    "I grew up poor. Now I have money and I don't trust it.",
    "I want to be wealthy but I'm ashamed of wanting it.",
    "I spend money to feel something. I know it's not working.",
    "Is it ethical to be rich when others have nothing?",
    "I know I should invest. I spend it anyway. Why?",
    "I'd rather be broke doing something I love than rich doing something I don't.",
    "Money has changed my relationships and I'm not sure it was worth it.",
    "I'm financially successful by every metric. I feel like a fraud.",
    "Should I chase financial security or meaning? Can I have both?",
    "My worth feels tied to my net worth. I hate that about myself."
  ],

  morality: [
    "I did something I'm not proud of and no one will ever know.",
    "I watched someone being treated unfairly and said nothing.",
    "Is it wrong to put yourself first when others are suffering?",
    "I've lied to protect someone I love. Was it right?",
    "I disagree with my culture's values but I still live by them.",
    "How do I know if I'm a good person or just performing goodness?",
    "I believe something is wrong but everyone around me accepts it.",
    "I want to do the right thing but I don't know what that is anymore.",
    "Is forgiveness something you owe someone or something you choose?",
    "I've hurt someone. I've apologized. They haven't forgiven me. Now what?"
  ]

}

export const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat()

export const CATEGORY_QUESTIONS = {
  career:        QUESTION_BANK.career,
  relationships: QUESTION_BANK.relationships,
  society:       QUESTION_BANK.society,
  existence:     QUESTION_BANK.existential,
  morality:      QUESTION_BANK.morality,
  money:         QUESTION_BANK.money
}
