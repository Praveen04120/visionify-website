-- Add new columns for Official Partners (collaborators)
ALTER TABLE portfolio_items 
ADD COLUMN IF NOT EXISTS contract_start_date DATE NULL,
ADD COLUMN IF NOT EXISTS contract_end_date DATE NULL,
ADD COLUMN IF NOT EXISTS about TEXT NULL,
ADD COLUMN IF NOT EXISTS mou_url TEXT NULL,
ADD COLUMN IF NOT EXISTS mou_file_name TEXT NULL;
