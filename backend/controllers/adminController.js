export const generateInvitationCode = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can generate invitation codes.' });
    }

    const code = await user.generateInvitationCode();

    return res.status(200).json({
      success: true,
      message: 'Invitation code generated successfully',
      data: { code }
    });
  } catch (error) {
    next(error);
  }
};
