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

    # git tree is dirty, will return 0 if the working directory is clean and 1 if there are changes to be committed.
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
