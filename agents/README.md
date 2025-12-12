# AI Agents & Workflows

This directory contains AI workflows and agent-specific configurations for the ELCC Data Management system.

## Directory Structure

```
agents/
├── README.md              (this file)
├── workflows/             (shared workflow repository)
│   ├── create-admin-ui.md
│   └── README.md
├── claude/               (optional - Claude-specific hardlinks)
│   └── workflows/
├── windsurf/             (optional - Windsurf-specific hardlinks)
│   └── workflows/
└── cursor/               (optional - Cursor-specific hardlinks)
    └── workflows/
```

---

## What are Workflows?

Workflows are AI-readable documents that guide coding assistants through complex, multi-step tasks. They include:

- Step-by-step instructions
- Code templates
- Implementation checklists
- Common pitfalls to avoid
- Testing strategies

**Available Workflows:**
- [create-admin-ui.md](workflows/create-admin-ui.md) - Add full CRUD admin UI for any model

---

## Using Workflows with AI Assistants

### Method 1: Direct Reference (Simplest)

Just reference the workflow directly:

```
Hey Claude, follow the workflow in agents/workflows/create-admin-ui.md 
to create admin UI for the Payment model.
```

### Method 2: Hardlinks (Recommended for Multiple Agents)

Hardlinks allow you to maintain a single source of truth while placing workflows in agent-specific locations.

#### What are Hardlinks?

A hardlink is a directory entry that points to the same file data on disk. Multiple hardlinks to the same file:
- Share the same content (edit one, all are updated)
- Don't take extra disk space
- Work across the filesystem (same partition)

**Benefits:**
- ✅ Single source of truth in `agents/workflows/`
- ✅ Each AI tool finds workflows in its expected location
- ✅ Updates to one link update all
- ✅ No file duplication
- ✅ No risk of files getting out of sync

---

## Setup Instructions

### For Claude Code (CLI)

Claude Code looks for workflows in `.claude/workflows/`:

```bash
# Create directory
mkdir -p .claude/workflows

# Create hardlinks
ln agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md

# Verify
ls -li .claude/workflows/
# Should show same inode number as agents/workflows/create-admin-ui.md
```

### For Windsurf

Windsurf looks for workflows in `.windsurf/workflows/`:

```bash
# Create directory
mkdir -p .windsurf/workflows

# Create hardlinks
ln agents/workflows/create-admin-ui.md .windsurf/workflows/create-admin-ui.md

# Verify
ls -li .windsurf/workflows/
```

### For Cursor

Cursor looks for workflows in `.cursor/workflows/`:

```bash
# Create directory
mkdir -p .cursor/workflows

# Create hardlinks
ln agents/workflows/create-admin-ui.md .cursor/workflows/create-admin-ui.md

# Verify
ls -li .cursor/workflows/
```

### For Agent-Specific Customizations (Optional)

If you need agent-specific versions, you can:

1. **Keep in `agents/[agent-name]/`** instead of hardlinking:
   ```bash
   mkdir -p agents/claude/workflows
   cp agents/workflows/create-admin-ui.md agents/claude/workflows/
   # Edit agents/claude/workflows/create-admin-ui.md as needed
   ```

2. **Then hardlink the customized version:**
   ```bash
   ln agents/claude/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md
   ```

---

## Quick Setup Script

Create all hardlinks at once:

```bash
#!/bin/bash
# setup-workflows.sh

# Define agents and their workflow directories
declare -A AGENT_DIRS=(
    [".claude"]="workflows"
    [".windsurf"]="workflows"
    [".cursor"]="workflows"
)

# Source workflows directory
SOURCE_DIR="agents/workflows"

# Create hardlinks for each agent
for agent_dir in "${!AGENT_DIRS[@]}"; do
    workflow_dir="${agent_dir}/${AGENT_DIRS[$agent_dir]}"
    
    # Create directory if it doesn't exist
    mkdir -p "$workflow_dir"
    
    # Hardlink all workflows
    for workflow in "$SOURCE_DIR"/*.md; do
        if [ -f "$workflow" ] && [ "$(basename "$workflow")" != "README.md" ]; then
            target="$workflow_dir/$(basename "$workflow")"
            
            # Remove existing file/link if present
            [ -e "$target" ] && rm "$target"
            
            # Create hardlink
            ln "$workflow" "$target"
            echo "✓ Linked $(basename "$workflow") to $workflow_dir/"
        fi
    done
done

echo ""
echo "✅ All workflows linked successfully!"
echo ""
echo "Verify with: ls -li .claude/workflows/ .windsurf/workflows/ .cursor/workflows/"
```

**Usage:**
```bash
chmod +x setup-workflows.sh
./setup-workflows.sh
```

---

## Verifying Hardlinks

Check that files share the same inode (same file on disk):

```bash
# List with inode numbers
ls -li agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md

# Should show same inode number (first column), like:
# 1234567 -rw-r--r-- 2 user user 50000 Dec 9 10:00 agents/workflows/create-admin-ui.md
# 1234567 -rw-r--r-- 2 user user 50000 Dec 9 10:00 .claude/workflows/create-admin-ui.md
#         ^-- Same inode = same file
```

The link count (third number) shows how many hardlinks exist to the file.

---

## Adding New Workflows

1. **Create in `agents/workflows/`**:
   ```bash
   cat > agents/workflows/my-new-workflow.md << 'WORKFLOW'
   ---
   description: Description of what this workflow does
   auto_execution_mode: 1
   ---
   
   # My New Workflow
   
   [Content here...]
   WORKFLOW
   ```

2. **Run setup script** or manually hardlink:
   ```bash
   ./setup-workflows.sh
   # or
   ln agents/workflows/my-new-workflow.md .claude/workflows/my-new-workflow.md
   ```

3. **Update READMEs**:
   - Add to `agents/workflows/README.md`
   - Optionally add to this file

---

## Workflow Frontmatter

All workflows should include frontmatter:

```yaml
---
description: Brief description of workflow purpose and scope
auto_execution_mode: 1
---
```

- `description`: Helps AI understand when to use this workflow
- `auto_execution_mode: 1`: Enables automatic execution in supported tools

---

## Git Configuration

**Recommended `.gitignore` entries:**

```gitignore
# Agent-specific directories (if using hardlinks to them)
.claude/workflows/
.windsurf/workflows/
.cursor/workflows/

# Keep the source workflows
!agents/workflows/
```

This approach:
- ✅ Tracks the source workflows in `agents/workflows/`
- ✅ Ignores agent-specific hardlinks (they're duplicates)
- ✅ Each developer runs setup script to create their hardlinks
- ✅ Prevents merge conflicts

**Alternative (track everything):**
```gitignore
# Track all workflows
!agents/workflows/
!.claude/workflows/
!.windsurf/workflows/
!.cursor/workflows/
```

---

## Best Practices

1. **Single Source of Truth**
   - Always edit workflows in `agents/workflows/`
   - Hardlinks ensure changes propagate everywhere

2. **Descriptive Names**
   - Use `verb-noun.md` format: `create-admin-ui.md`, `setup-database.md`
   - Keep names short but clear

3. **Include Frontmatter**
   - Always add description and auto_execution_mode
   - Helps AI assistants understand purpose

4. **Reference Implementations**
   - Include commit hashes for reference implementations
   - Example: `Reference: FundingRegion (commit: 973af90)`

5. **Keep Workflows Focused**
   - One workflow = one major task
   - Break complex tasks into multiple workflows if needed

6. **Update READMEs**
   - Document new workflows
   - Keep examples up to date

---

## Troubleshooting

### Hardlink Not Working?

**Problem:** `ln: failed to create hard link: Invalid cross-device link`

**Solution:** Source and destination must be on same filesystem. Use symlinks instead:
```bash
ln -s ../../agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md
```

Note: Symlinks don't share inodes but still work for most purposes.

### Changes Not Appearing?

**Check inode:**
```bash
ls -li agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md
```

If inode numbers differ, it's not a hardlink. Recreate:
```bash
rm .claude/workflows/create-admin-ui.md
ln agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md
```

### File Accidentally Deleted?

Hardlinks protect against accidental deletion! As long as one hardlink exists, the file data remains. Simply recreate the hardlink:
```bash
ln agents/workflows/create-admin-ui.md .claude/workflows/create-admin-ui.md
```

---

## Examples

### Using with Claude Code

```bash
# Reference workflow directly
claude "Follow agents/workflows/create-admin-ui.md to create admin UI for Payment model"

# Or with hardlink in place
claude "Use the create-admin-ui workflow for Payment model"
```

### Using with Windsurf

Open command palette and reference:
```
@workflow create-admin-ui
Create admin UI for Payment model
```

### Using with Cursor

```
Use .cursor/workflows/create-admin-ui.md to implement admin UI for Payment model
```

---

## Contributing

When adding workflows:

1. Create in `agents/workflows/`
2. Include proper frontmatter
3. Follow existing format and structure
4. Test with at least one AI assistant
5. Update READMEs
6. Commit to git

---

## Resources

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Windsurf Documentation](https://docs.windsurf.ai/)
- [Cursor Documentation](https://cursor.sh/docs)

---

**Last Updated:** 2025-12-09
**Maintained By:** Development Team
