(function() {
  var test_patterns;

  test_patterns = {
    singleton: {
      "name": "Singleton",
      "category": "Creational",
      "intent": "Ensure a class only has one instance, and provide a global point of acg cess to it",
      "motivation": "It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
      "applicability": "there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
      "structure": "Cambiar por BLOB"
    },
    prototype_pattern: {
      "name": "Prototype",
      "category": "Creational",
      "intent": "Specify the kinds of objects to create using a prototypical instance, and create",
      "motivation": "Use the Prototype Pattern when a client needs to create  a set of",
      "applicability": "Use the Prototype pattern when a system should be independent of how its products",
      "structure": "Cambiar por BLOB"
    },
    factory_method: {
      "name": "Factory Method",
      "category": "Creational",
      "intent": "Define an interface for creating an object, but let subclasses decide which class to instantiate. Lets a class defer instantiation to subclasses",
      "motivation": "",
      "applicability": "",
      "structure": ""
    },
    modified_singleton: {
      "name": "Singleton",
      "category": "MODIF Creational",
      "intent": "MODIF Ensure a class only has one instance, and provide a global point of acg cess to it",
      "motivation": "MODIF It's important for some classes to have exactly one instance. Making a class responsible for keepintrack of its sole instance.",
      "applicability": "MODIF there must be exactly one instance of a class, and it must be accessible.\\nwhen the sole instance should be extensible by subclassing, and clients",
      "structure": "MODIF Cambiar por BLOB"
    },
    modified_prototype: {
      "name": "Prototype",
      "category": "MODIF Creational",
      "intent": "MODIF Specify the kinds of objects to create using a prototypical instance, and create",
      "motivation": "MODIF Use the Prototype Pattern when a client needs to create  a set of",
      "applicability": "MODIF Use the Prototype pattern when a system should be independent of how its products",
      "structure": "MODIF Cambiar por BLOB"
    }
  };

  module.exports = test_patterns;

}).call(this);
