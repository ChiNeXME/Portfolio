# Adding devlogs and projects

1. Run one of these (or copy an existing `.md` file in `devlogs/` or `projects/`):

   ```
   python tools/content.py new devlog "My devlog title"
   python tools/content.py new project "My project title"
   ```

2. Open the new `.md` file, fill in the header (title, date, summary, tags) and type the write-up underneath in markdown. Put images in `images/` and use `![alt text](images/name.png)`.
3. Run `python tools/content.py` to refresh the lists (the `new` command already does this once). Then commit and push.

Projects can also set `image:` (thumbnail), `link:` (play or source URL) and `linkLabel:` (button text) in the header.
