class Book {
  private id: string;
  private title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  getId(): string {
    return this.id;
  }

  describe(): string {
    return `${this.title} [${this.id}]`;
  }
}

class Member {
  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}

class Catalog<T extends HasId> {
  private items = new Map<string, T>();
  addItem(item: T): boolean {
    //refuses an item whose ID is already present
    if (this.items.has(item.getId())) {
      return false;
    }
    this.items.set(item.getId(), item);
    return true;
  }
  findItemById(id: string): T | undefined {
    return this.items.get(id);
  }
  countItems(): number {
    return this.items.size;
  }
  all(): T[] {
    return Array.from(this.items.values());
  }
}
interface HasId {
  getId(): string;
}

const books = new Catalog<Book>();
console.log(books.addItem(new Book("B-001", "Things Fall Apart")));
console.log(books.addItem(new Book("B-002", "So Long a Letter")));
console.log(books.addItem(new Book("B-001", "Another Copy")));

const members = new Catalog<Member>();
members.addItem(new Member("M-01", "Awa"));

console.log(books.countItems(), members.countItems());

const found = books.findItemById("B-002");
if (found) console.log(found.describe());

const awa = members.findItemById("M-01");
if (awa) console.log(awa.getName());

console.log(books.findItemById("B-999"));
//experiment 2.2

//Argument of type 'Member' is not assignable to parameter of type 'Book'.
// Type 'Member' is missing the following properties from type 'Book': title, describe

//Type 'number' does not satisfy the constraint 'HasId'.

//'found' is possibly 'undefined'.
class Ratings<T extends HasId> {

  private ratings = new Map<
    string,
    { item: T; total: number; count: number }
  >();

  rate(item: T, stars: number): boolean {

    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return false;
    }

    const id = item.getId();
    const existing = this.ratings.get(id);

    if (existing) {
      existing.total += stars;
      existing.count++;
    } else {
      this.ratings.set(id, {
        item: item,
        total: stars,
        count: 1
      });
    }

    return true;
  }

  average(id: string): number | undefined {

    const rating = this.ratings.get(id);

    if (!rating) {
      return undefined;
    }

    return rating.total / rating.count;
  }

  best(): T | undefined {

    let bestItem: T | undefined = undefined;
    let highestAverage = -Infinity;

    for (const rating of this.ratings.values()) {

      const currentAverage = rating.total / rating.count;

      if (currentAverage > highestAverage) {
        highestAverage = currentAverage;
        bestItem = rating.item;
      }
    }

    return bestItem;
  }
}

const ratings = new Ratings<Book>();
const novel = new Book("B-001", "Things Fall Apart");
const letter = new Book("B-002", "So Long a Letter");

console.log(ratings.rate(novel, 5), ratings.rate(novel, 4), ratings.rate(letter, 4), ratings.rate(letter, 6), ratings.rate(letter, 4.5));
console.log(ratings.average("B-001"), ratings.average("B-002"), ratings.average("B-999"));

const top = ratings.best();
if (top) console.log(top.describe());

console.log(new Ratings<Member>().best());