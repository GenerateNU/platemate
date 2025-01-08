## Want to make changes to our database structure?

### Here's how:

1. Clone Production Database, call your test db "dev-[feature]" (ex. dev-auth, dev-posts).
2. Change your environment (.env) to use the new database you created.
3. Make schema changes if appropriate in `/database/validation.go`
4. Create a script in `/database/scripts` to perform your aggregations or use the utility classes in `/database/utils/Database` to modify your database.
5. Be sure to call `ApplySchema` utility if schema changes are made within your script at the top.
6. Once your happy with your changes, throw your PR up.
7. Once your PR is approved, connect to Production and run your scripts.

**Questions?**
Slack a TL!
