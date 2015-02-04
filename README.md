# Cucumber

    var supportCodeHelper = {
      Around           : self.defineAroundHook,
      Before           : self.defineBeforeHook,
      After            : self.defineAfterHook,
      Given            : self.defineStep,
      When             : self.defineStep,
      Then             : self.defineStep,
      defineStep       : self.defineStep,
      registerListener : self.registerListener,
      registerHandler  : self.registerHandler,
      World            : worldConstructor
    };

    projectFromBranch = master # default
    projectTowardsBranch = $currentBranch # git rev-parse --abbrev-ref HEAD

    projectFromVersion = abc
    projectTowardsVersion = abc2
    
    projectFromVersion/
    projectTowardsVersion/

# Version Switcher

Will NOT run unless

    # check if git tree is dirty, will return 0 if the working directory is clean and 1 if there are changes to be committed.
    test -z "$(git status --porcelain)"
    CURRENT_BRANCH_CLEAN_OK=$?

    # towardsVersion does not contain all commits in fromVersion
    git branch -r --contains $PROJECT_FROM_VERSION | grep "origin/$PROJECT_TOWARDS_BRANCH\$"
    FEATURE_BRANCH_CONTAINS_HEAD_OF_MASTER_OK=$?

# Screenshot plan

According to features in `Shedfile` and `features/*.feature`

For each screensize
  For each URL to visit
    For each 

# Directory Structure

blank images are possible, layers are stacked

<featureName>-<clickStack> => can-oni-cal

series/can-oni-cal/<sreenSize> # history of feature, grouped by screenSize
  0 => <uuid>-<md5> # ordering by created-at on disk is important, 0 is symbolic
  1

series/can-ani-cal/<screenSize>
  0
  1

branches/$branchNameLeft/<screenSize> # see the stack of screenshots for a given branch, grouped by screenSize
  can-oni-cal => series/can-oni-cal/0
  can-ani-cal => series/can-ani-cal/0

branches/$branchNameRight/<screenSize>
  can-oni-cal => series/can-oni-cal/1
  can-ani-cal => series/can-ani-cal/1

deltas/$branchNameLeft/$branchNameRight/<screenSize> # differences between noted branchNames, grouped by screenSize ...
  can-oni-cal # created if branches/$branchNameLeft/can-oni-cal != branches/$branchNameRight/can-oni-cal, md5 used as shortcut
    
changes/<screenSize> # for a given screenSize, and feature, what has it looked like over time
  can-oni-cal/
    0 # created when deltas/$branchNameLeft/$branchNameRight/<screenSize>/can-oni-cal created
    1
    2
    3
    4

latest/ => deltas/$lastKnownGoodVersion/$currentVersion


ListOfImages




