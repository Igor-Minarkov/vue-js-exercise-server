const events = {};
let currentId = 0;

module.exports = {
  total: () => Object.keys(events).length,
  save: (event) => {
    const id = ++currentId;
    event.id = id;

    let newEvent = {
      id,
      name: event.name,
      description: event.description,
      price: event.price,
      createdOn: new Date(),
      createdBy: event.createdBy,
    };

    events[id] = newEvent;
  },

  edit: (event) => {
    events[event.id].name = event.name;
    events[event.id].description = event.description;
    events[event.id].price = event.price;
  },

  all: (page, search) => {
    const pageSize = 10;

    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + pageSize;

    return Object.keys(events)
      .map((key) => events[key])
      .filter((event) => {
        if (!search) {
          return true;
        }

        const eventName = event.name.toLowerCase();
        const eventType = event.type.toLowerCase();
        const searchTerm = search.toLowerCase();

        return (
          eventName.indexOf(searchTerm) >= 0 ||
          eventType.indexOf(searchTerm) >= 0
        );
      })
      .sort((a, b) => b.id - a.id)
      .slice(startIndex, endIndex);
  },
  findById: (id) => {
    return events[id];
  },

  byUser: (user) => {
    return Object.keys(events)
      .map((key) => events[key])
      .filter((event) => event.createdBy === user)
      .sort((a, b) => b.id - a.id);
  },
  delete: (id) => {
    delete events[id];
  },
};
