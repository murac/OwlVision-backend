# OwlVision v0.1

## Get up and running

1. `git@gitlab.com:TheLeftovers/CEN4010.git` (set up your SSH keys first! instructions are given by gitlab in that screen)
2. `npm install`
3. `npm run dev`

## How Make Changes to Repo

1. In your terminal, in the root directory of the project after cloning the repo, run `git branch` to ensure you are in the master branch. If you are not, then run `git checkout master` to change branches
2. Now make sure your branch is up to date by running `git pull origin master`
3. Now you are ready to create a new branch where you can work on new features. The following will create a new branch and change branches in one line: `git checkout -b branch_name` branch_name can be anything you want
4. Now make modification to the code however you want.
5. When you are ready to push them back to the repo, you must execute these operations:
 1. `git add . --all` to stage modified files for commit
 2. `git commit -m "describe your changes here in the commit message"`
 3. `git push origin branch_name`
6. Now your branch will be pushed to the repo but will not have merged with the master branch yet. For this, you may either follow the link provided by gitlab in the terminal or just go into gitlab > branches and next to the branch you just updated, there will be a "merge request" button. Click it and submit it. Once it's approved it will be merged to master.

References I used to make this:

[[1] Building a Simple CRUD Application with Express and MongoDB](https://zellwk.com/blog/crud-express-mongodb/)

[[2] Express Code Structure](https://github.com/focusaurus/express_code_structure)

[[**]Markdown Reference](https://gitlab.com/help/user/markdown)
