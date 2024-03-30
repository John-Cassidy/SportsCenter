# SportsCenter

Building FullStack App using Net8 &amp; Angular

[Udemy Course](https://github.com/rahulsahay19/dotnet-angular-chatgpt)

## dotnet ef migrations

### Create Migration

When setting up development for first time with SqlServer container, run manual migration from command line in solution folder.

```powershell
dotnet ef migrations add InitialCreate -o Data/Migrations -p server/Infrastructure -s server/Api
```

Where InitialCreate is the name that we will give our migration, you can change this name with details of what your migration refers to, such as changing a field in a table, adding or removing fields, by convention we try to detail the update that the migration will do.

-p (project) we pass the name of the solution that contains our DbContext in the case of Infrastructure

-s (solution) we pass our main project in the case of the API

If everything went well after running the command you will get a message like this: 'Done. To undo this action, use ‘ef migrations remove’'

### Update database schema with Migration

To apply any pending migrations to the database, effectively updating the database schema. If no migrations are pending, this command has no effect.

The `-p` option specifies the project that contains the DbContext at `server/Infrastructure`.

The `-s` option specifies the startup project, which is the project that the tools build and run to get the DbContext and its configuration. In this case, the startup project is located at `server/Api`.

```powershell
dotnet ef database update -p server/Infrastructure -s server/Api
```

## Implement Error Handling

[Youtube Video](https://www.youtube.com/watch?v=uOEDM0c9BNI)

### Option 1: IExceptionHandler Interface for handling unhandled exceptions globally

[Youtube Video](https://www.youtube.com/watch?v=f4zMGR3m70Y)

### Option 2: Result Pattern for handling both handled/unhandled expceptions

[Article](https://www.milanjovanovic.tech/blog/functional-error-handling-in-dotnet-with-the-result-pattern)

## Generic Repository Pattern

A design pattern for abstracting data access logic

- Separate data access from business logic
- Provides standardized data interaction

Components:

- Repository interface
- Generic Repository
- Concrete Repository
- Abstraction
- Decoupling
- Reusability

## Specification Pattern

The Specification Pattern is a software design pattern that encapsulates the logic of a business rule into a single unit. It's often used in the context of domain-driven design (DDD).

The pattern allows you to encapsulate some piece of domain knowledge (a "specification") into a separate class, which can then be reused and combined with other specifications to create complex business rules.

A specification is typically a predicate (a function that returns a boolean). It takes an object as input and returns true if the object satisfies the specification, and false otherwise.

- `Definition`: The Specification Pattern is a software design pattern that encapsulates the logic of a business rule into a single unit. It's often used in the context of domain-driven design (DDD).
- `Predicate Function`: A specification is typically a predicate function that takes an object as input and returns true if the object satisfies the specification, and false otherwise.
- `Encapsulation of Domain Knowledge`: The pattern allows you to encapsulate some piece of domain knowledge (a "specification") into a separate class, which can then be reused and combined with other specifications to create complex business rules.
- `Reuse and Combination`: The power of the Specification Pattern comes from its ability to be combined with other specifications. You can create complex rules by combining simpler ones.
- `Examples`: For example, you might have a specification that checks if a customer is eligible for a discount. This specification could be used in various parts of your application, such as when calculating the price of an order or when displaying available discounts to the user.

## Searching, Filtering, Sorting, Paging Capabilities

- Filtering
- Sorting
- Searching
- Paging
- Extending Specifications
