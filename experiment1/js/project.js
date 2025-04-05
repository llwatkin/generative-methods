// project.js - A random muffin recipe generator
// Author: Lyle Watkins
// Date: 4 April 2025

const fillers = {
  adj: ['Yummy', 'Delicious', 'Unique', 'Unusual', 'Tasty', 'Easy', 'Simple', 'Strange', 'Human', 'Cool', 'Creative', 'Nostalgic', 'Savory', 'Sweet'],
  flour: ['all-purpose', 'almond', 'coconut', 'oat', 'hemp', 'gluten-free', 'rice', 'soy'],
  sugar: ['light brown sugar', 'brown sugar', 'granulated sugar', 'powdered sugar', 'pearl sugar', 'cane sugar', 'coconut sugar', 'honey', 'agave nectar', 'maple syrup', 'molasses'],
  oil: ['vegetable oil', 'safflower oil', 'avocado oil', 'butter', 'olive oil', 'peanut oil', 'lard', 'coconut oil', 'almond oil', 'macadamia oil'],
  milk: ['chocolate', 'whole', 'strawberry', 'coconut', 'peanut', 'oat', 'soy', 'skim', 'goat', 'sheep', 'buffalo', 'almond'],
  seasoning: ['pepper', 'cinnamon', 'nutmeg', 'oregano', 'allspice', 'basil', 'paprika', 'cumin', 'ginger', 'cacao powder'],
  extract: ['vanilla', 'lemon', 'orange', 'lime', 'almond', 'peppermint', 'coconut', 'banana', 'maple', 'rum'],
  special: ['blueberries', 'chopped strawberries', 'peanuts', 'chopped almonds', 'chopped walnuts', 'macadamia nuts', 'chocolate chips', 'chocolate chunks', 'coconut flakes', 'shredded chicken', 'shredded beef', 'chopped carrots', 'chopped broccoli', 'chopped banana', 'beans', 'chopped mango', 'chopped pear', 'chopped apple'],
};

const template = `$adj Muffin Recipe

1 1/2 cups $flour flour
3/4 cup $sugar
2 tsp baking powder
1/4 tsp salt
1/2 tsp $seasoning
1/3 cup $oil
1 large egg
1/3 cup $milk milk
1 tsp $extract extract
1 cup $special`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();